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
const {body, validationResult} = require('express-validator');

///////
 const rooms = require('./back/rooms');
//////

const mysql = require('mysql');
const { newRoom, joinRoom } = require('./back/rooms');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//Set static folder
app.use(express.static((__dirname+"/front")));
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
    if (!sessionData.username){
        res.sendFile(__dirname + '/front/html/login.html'); 
    }
    else{
        if(!sessionData.currentGameId){   
            req.session.currentGameId = rooms.newRoom(playerId = req.sessionID);  
            res.sendFile(__dirname + '/front/html/lobby.html');
        }else{
            if(joinRoom(sessionData.currentGameId, playerId = req.sessionID)){
                res.sendFile(__dirname + '/front/html/lobby.html');
                //console.log(rooms.getData(sessionData.currentGameId));
            }
            else{
                res.sendFile(__dirname + '/front/html/login.html');
            }
        }
    }
});

app.post('/login', urlencodedParser, (req, res) => {
    const username = req.body.username;
    const currentGameId =  req.body.currentGameId;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
    }else{
        req.session.username = username;
        req.session.currentGameId = currentGameId;        
        req.session.save()
        res.redirect('/');
    }
})



//Start serveur
http.listen(55555, ()=>{
    console.log('Serveur lancé sur le port 55555');
});

io.on('connection',(socket)=>{
    
    if(socket.handshake.session.currentGameId){
        let gameId = socket.handshake.session.currentGameId;
        socket.join(gameId);


        socket.on('getRoomInfo', () =>{
            //console.log('data demandée');
            socket.emit('roomInfo',rooms.getData(gameId));
        });
    }



});


