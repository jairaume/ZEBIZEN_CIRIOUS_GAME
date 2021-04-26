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
const mysql = require('mysql');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//Set static folder
app.use(express.static((__dirname+"/front")));
app.use(express.static((__dirname+"/front/assets")));
app.use(urlencodedParser);
app.use(session);


// Redirige vers le jeu ou la page de connexion
app.get('/', (req, res) => {
    if (!session.username){
        res.sendFile(__dirname + '/front/html/login.html'); 
    }
    else{
        res.sendFile(__dirname + '/front/html/lobby.html');
    }
});


//Start serveur
http.listen(22222, ()=>{
    console.log('Serveur lancé sur le port 22222');
});

const state = {};
const rooms = new Array();

io.on('connection',(socket)=>{
    console.log('Nouvelle connection au serveur');

    /*socket.on('new-game',(username)=>{
        console.log("Creation d'un salon");    
        let roomId=''
        do{roomId = generateId()}
        while(rooms.find(room=>{room === roomId}))
        
        console.log('Le code est :',roomId);
        rooms[socket.id] = roomId;
        socket.emit('game-code',roomId);
        
        state[roomId] = createGameState(roomId, socket.id);
        
        socket.join(roomId)
        socket.number = 1;
        socket.emit('init',1);
        
        // Store login
        req.session.username = username;
        req.session.gameId = roomId;
        
        req.session.save()
        res.redirect('/');
        }
    })*/
});

function createGameState(id,owner){
    return {
        roomId: id,
        playerList: new Array(),
        gameStatus: false,
        owner: owner
    }
}

function generateId(){
    let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = '#';
    let char = ''
    for (let i=0; i<5; i++){
        char = alphabet.charAt(Math.floor(Math.random()*alphabet.length));
        code += char;
    }
    return code;
}