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
const functionBins = require('./back/bins');
allFunctionBins = new functionBins();
///////
///////
const rooms = require('./back/rooms');
const games = require('./back/gamesInfos');
//////
let sessionInfo = new Array();
/////

const mysql = require('mysql');
const { newRoom, joinRoom } = require('./back/rooms');
const gamesInfos = require('./back/gamesInfos');
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
                if (!rooms.isPlayerInRoom(sessionData.currentGameId, req.sessionID) && !rooms.getGameStatus(sessionData.currentGameId)) {//si le joueur n'est pas deja dans la room && que la game n est pas deja lancée
                    rooms.joinRoom(sessionData.currentGameId, req.sessionID, sessionData.username);
                } else {
                    //res.sendFile(__dirname + '/front/html/login.html');
                }
                if (rooms.isPlayerInRoom(sessionData.currentGameId, req.sessionID)) {
                    if (rooms.getGameStatus(sessionData.currentGameId)) {
                        res.sendFile(__dirname + '/front/html/index.html');
                    } else {
                        res.sendFile(__dirname + '/front/html/lobby.html');
                    }
                    //console.log(rooms.getData(sessionData.currentGameId));
                }
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
http.listen(22222, () => {
    console.log('Serveur lancé sur le port 55555');
});

io.on('connection', (socket) => {

    if (socket.handshake.session.currentGameId) {
        const gameId = socket.handshake.session.currentGameId;
        const sessionId = socket.handshake.sessionID;
        socket.join(gameId);


        socket.on('getRoomInfo', () => {
            console.log('connection de '+ socket.handshake.session.username +' a '+socket.handshake.session.currentGameId);
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
            if (rooms.getNbReady(gameId) == rooms.getNbPlayer(gameId)) {
                rooms.generateImposteur(gameId);
                rooms.setGameStatus(gameId, true);
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

        socket.on('new-message', message => {
            let data = {
                username: socket.handshake.session.username,
                message: message
            }
            socket.to(gameId).emit('message', data);
            socket.emit('message', data);
        })


        /*-------------SETTINGS------------*/
        socket.on('color', color => {
            rooms.changeColor(gameId, sessionId, color)
            socket.emit('newInfo', rooms.getData(gameId));
            socket.to(gameId).emit('newInfo', rooms.getData(gameId));
        })

        socket.on('speed', speed => {
            rooms.changeSpeed(gameId, speed)
            socket.emit('newInfo', rooms.getData(gameId));
            socket.to(gameId).emit('newInfo', rooms.getData(gameId));
        })
        socket.on('nbImpo', nb => {
            rooms.changeNbImpo(gameId, nb)
            socket.emit('newInfo', rooms.getData(gameId));
            socket.to(gameId).emit('newInfo', rooms.getData(gameId));
        })
        socket.on('gameDuration', dur => {
            rooms.changeGameDuration(gameId, dur)
            socket.emit('newInfo', rooms.getData(gameId));
            socket.to(gameId).emit('newInfo', rooms.getData(gameId));
        })
        socket.on('nbDechets', nb => {
            rooms.changeNbDechet(gameId, nb)
            socket.emit('newInfo', rooms.getData(gameId));
            socket.to(gameId).emit('newInfo', rooms.getData(gameId));
        })
        socket.on('modeIncognito', bool => {
            rooms.changeMode(gameId, bool)
            socket.emit('newInfo', rooms.getData(gameId));
            socket.to(gameId).emit('newInfo', rooms.getData(gameId));
        })

        // Obtenir depuis les settings le timer et le nombre de déchets objectifs
        socket.on("getGameDurationServer", () => {
            socket.emit("gameDurationClient", rooms.getData(gameId).gameDuration)
        })
        socket.on("getGarbageObjServer", () => {
            //console.log("Nombre de déchets : ",rooms.getData(gameId).nbDechets)
            socket.emit("garbageObjClient", rooms.getData(gameId).nbDechets)
        })

        //-------------- Creation de la partie --------

        socket.on('createGameInfos', (gameId) => {
            gamesInfos.addGame(gameId);
            //console.log('gameInfos:' +gamesInfos.getGameInfos(gameId));
        });

        socket.on('getGameInfos', (gameId) => {
            let data = gamesInfos.getGameInfos(gameId);
            socket.emit('giveGameInfos', (data));
        });

        socket.on('joinGame', (gameId, playerId, username) => {
            gamesInfos.addGame(gameId);
            gamesInfos.addPlayer(gameId, playerId, username);
            /*
                        let data = gamesInfos.getGameInfos(gameId);
                        socket.emit('giveGameInfos', (data));*/
            //console.log('rejoindre partie ', gamesInfos.getGameInfos(gameId));

        });

        //MULTIPLAYER GAME
        socket.on('move', (data) => {
            socket.to(gameId).emit('move', { x: data.x, y: data.y, layer: data.layer, id: data.id });
        })
        socket.on('end-move', (id) => {
            socket.to(gameId).emit('end-move', id);
        })
        socket.on('kicking', (id) => {
            socket.to(gameId).emit('isKicking', id);
        });
        //
        /************POUBELLES**************/
        //
        //PLACEMENT POUBELLES
        socket.on('generate-bins-query', () => {
            let bins = allFunctionBins.generateBins();
            gamesInfos.setPoubelles(gameId, bins);
            //console.log(bins);          
            socket.to(gameId).emit('generate-bins', bins);
            socket.emit('generate-bins', bins);
        });

        //changement de place des poubelles
        socket.on('regenerate-bins-query', () => {
            let bins = allFunctionBins.generateBins();
            gamesInfos.setPoubelles(gameId, bins);
            socket.to(gameId).emit('regenerate-bins', bins);
            socket.emit('regenerate-bins', bins);
        });

        //modif poubelle connue ou non
        socket.on('setPoubelleUnknowAttribute', (poubelleColor, value) => {
            gamesInfos.setPoubelleUnknowAttribute(gameId, poubelleColor, value);
            socket.to(gameId).emit('generate-bins', gamesInfos.getPoubelles(gameId));
            //socket.emit('generate-bins', gamesInfos.getPoubelles(gameId));
        });
        //reload les poubelles
        socket.on('getPoubelles', (gameId = gameId) => {
            if (gamesInfos.getPoubelles(gameId)) {
                socket.emit('generate-bins', gamesInfos.getPoubelles(gameId));
            }
        });

        //renverser les poubelles
        socket.on('reverse-bin', (poubelleColor, angle) => {
            //console.log('je suis la avec : ', poubelleColor)
            gamesInfos.reverseBin(gameId, poubelleColor, angle);

            socket.to(gameId).emit('regenerate-bins', gamesInfos.getPoubelles(gameId));
            socket.emit('regenerate-bins', gamesInfos.getPoubelles(gameId));
        });

        // Incrémentation de la variabe comptant le nombre de déchets "réussis" par les joueurs d'une room
        socket.on("modifyGarbageServer", (goodChoice) => {
            if (goodChoice == 1) {
                //console.log("On increase")
                gamesInfos.increaseGarbage(gameId)
            } else if (goodChoice == -1) {
                //console.log("On decrease")
                gamesInfos.decreaseGarbage(gameId);
            }
            let garbageNum = gamesInfos.returnGarbageNumber(gameId);
            let variableGarbageMax = rooms.getData(gameId).nbDechets;
            /*
            console.log("garbageNum = ",garbageNum)
            console.log("variableGarbageMax = ",variableGarbageMax)*/

            io.in(gameId).emit("sendGarbageClient", garbageNum) // On envoie le nombre de déchets
            socket.emit("autorizationFalse");

            if (garbageNum == variableGarbageMax) {
                console.log("On envoie la socket de garbageWin à tlm !")
                io.in(gameId).emit("garbageWin");
                // ANNONCER LA WIIIIIIIIIIIIIIIN DES GENTILS
            }
        })

        //Mettre une poubelle sur la tete d'un player
        socket.on('setPoubelleHead', (id) => {
            socket.to(gameId).emit("setPoubelleHead", id);
            socket.emit("setPoubelleHead", id);

        })

        //DEBUT DE REUNION
        socket.on('reunion', () => {
            socket.to(gameId).emit('go-reunion')
            socket.emit('go-reunion')
            //console.log('Réunion !')
        })


        //Choix du mec qui part
        socket.on('vote', (voteId) => {
            gamesInfos.addVote(gameId, voteId);
            let maxVoteId;
            if (games.getAllVotes(gameId).length == games.getNbAlivePlayer(gameId)) {
                maxVoteId = games.elementFrequent(gameId, games.getAllVotes(gameId))
                games.setDead(gameId, maxVoteId);
                games.resetAllVotes(gameId);
                socket.to(gameId).emit("returnVote", maxVoteId);
                socket.emit("returnVote", maxVoteId);
            }

            if (games.isOnlyImposteurInlive(gameId)) {
                socket.to(gameId).emit('impoWin');
                socket.emit('impoWin');
            }
        });

        socket.on('stopGame', () => {
            if (games.getGameInfos(gameId)) {
                games.destroyGame(gameId);
                //console.log('games: '+games.getGameInfos(gameId));
            }
            if (rooms.getData(gameId)) {
                console.log('fin game: ' + gameId);
                rooms.destroy(gameId);
                //console.log('rooms: '+rooms.getData(gameId));
            }

        });

    }

});

