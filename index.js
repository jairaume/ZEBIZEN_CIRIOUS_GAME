/**** Import npm libs ****/

const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const bodyParser = require('body-parser');
const mysql = require('mysql');

//Set static folder
app.use(express.static((__dirname+"/front")));

// Redirige vers la page d'accueil
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/front/html/index.html');
});

//Start serveur
http.listen(8080, ()=>{
    console.log('Serveur lancé sur le port 8080');
});