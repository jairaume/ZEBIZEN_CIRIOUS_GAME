/**** Import npm libs ****/
const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const session = require("express-session")({
    secret: "eb8fcc253281389225b4f7872f2336918ddc7f689e1fc41b64d5c4f378cdc438",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        secure: false
    }
});
const sharedsession = require("express-socket.io-session");
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

///////
const rooms = require('./back/rooms');
//////
let sessionInfo = new Array();
/////

const mysql = require('mysql');
const { newRoom, joinRoom } = require('./back/rooms');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//Set static folder
app.use(express.static((__dirname + "/front")));
app.use(urlencodedParser);
app.use(session);

//config session

io.use(sharedsession(session, {
    autoSave: true
}));


// Redirige vers le jeu ou la page de connexion
app.get('/', (req, res) => {
    let sessionData = req.session;
    //console.log(sessionData);
    if (!sessionData.username) {
        res.sendFile(__dirname + '/front/html/login.html');
    }
    else {
        if (!sessionData.currentGameId) {//si pas de current game on crée la room   
            req.session.currentGameId = rooms.newRoom(playerId = req.sessionID, sessionData.username);
            res.sendFile(__dirname + '/front/html/lobby.html');
        } else {
            if (rooms.exist(sessionData.currentGameId)) {//si la game existe
                if (!rooms.isPlayerInRoom(sessionData.currentGameId, req.sessionID)) {//si le joueur n'est pas deja dans la room
                    rooms.joinRoom(sessionData.currentGameId, req.sessionID, sessionData.username);
                }
                if(rooms.getGameStatus(sessionData.currentGameId)){
                    res.sendFile(__dirname + '/front/html/index.html');
                }else{
                    res.sendFile(__dirname + '/front/html/lobby.html');
                }
                //console.log(rooms.getData(sessionData.currentGameId));
            }
            else {
                res.sendFile(__dirname + '/front/html/login.html');
            }
        }
    }
});

app.post('/login', urlencodedParser, (req, res) => {
    const username = req.body.username;
    const currentGameId = req.body.currentGameId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
    } else {
        req.session.username = username;
        req.session.currentGameId = currentGameId;
        req.session.save()

        sessionInfo[req.sessionID] = username;

        res.redirect('/');
    }
})



//Start serveur
http.listen(55555, () => {
    console.log('Serveur lancé sur le port 55555');
});

io.on('connection', (socket) => {

    if (socket.handshake.session.currentGameId) {
        const gameId = socket.handshake.session.currentGameId;
        const sessionId = socket.handshake.sessionID;
        socket.join(gameId);


        socket.on('getRoomInfo', () => {
            console.log('data demandée');
            let data = rooms.getData(gameId);
            data.me = sessionId;
            socket.emit('roomInfo', data);
            socket.to(gameId).emit('newInfo', data);
        });

        socket.on('ready', () => {
            rooms.makeReady(gameId, sessionId);
            let data = rooms.getData(gameId);
            socket.emit('toggle-ready', sessionId);
            socket.to(gameId).emit('toggle-ready', sessionId);
            if(rooms.getNbReady(gameId)==rooms.getNbPlayer(gameId)){
                rooms.setGameStatus(gameId,true);
                socket.emit('reload');
                socket.to(gameId).emit('reload');
            }
        });
        socket.on('not-ready', () => {
            rooms.makeNotReady(gameId, sessionId);
            let data = rooms.getData(gameId);
            socket.emit('toggle-ready', sessionId);
            socket.to(gameId).emit('toggle-ready', sessionId);
        });

        socket.on('leave', (playerId = sessionId) => {
            socket.handshake.session.currentGameId = '';
            socket.handshake.session.username = '';

            rooms.leaveRoom(gameId, playerId);
            socket.to(gameId).emit('newInfo', rooms.getData(gameId));
            socket.leave(gameId)
            socket.emit('reload');
        });
        socket.on('leave-query', playerId => {
            socket.to(gameId).emit('leave', playerId);
        });   
        
        
        //MULTIPLAYER GAME
        socket.on('move',(data)=>{
            socket.to(gameId).emit('move',{x:data.x, y:data.y});
        })
        socket.on('end-move',()=>{
            socket.to(gameId).emit('end-move');
        })
    }
});

