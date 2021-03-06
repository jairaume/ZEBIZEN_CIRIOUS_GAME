const state = [];
const rooms = new Array();


module.exports = {
    newRoom(playerId, username) {
        console.log("Creation d'un salon");
        let roomId = '';

        do {
            roomId = generateId()
        }
        while (rooms.find(room => { room === roomId }))

        rooms[playerId] = roomId;

        state[roomId] = createGameState(roomId, playerId, username);

        return roomId;
    },

    joinRoom(roomId, playerId, username) {

        state[roomId].playerList.push({
            id: playerId,
            username: username,
            isReady: false,
            isImposteur: false,
            isOwner:  playerId === state[roomId].owner.id?true:false,
            color: 0
        });
        return 1;
    },

    isPlayerInRoom(roomId, playerId) {
        let mem = false;

        for (const player of state[roomId].playerList) {
            if (player.id === playerId) {
                mem = true;
            }
        }
        return mem;
    },

    exist(roomId) {
        return state[roomId] != undefined;
    },

    getData(roomId) {
        return state[roomId];
    },

    makeReady(roomId, playerId){
        let index = state[roomId].playerList.findIndex((player)=> player.id == playerId)
        state[roomId].playerList[index].isReady = true;
    },

    makeNotReady(roomId, playerId){
        let index = state[roomId].playerList.findIndex((player)=> player.id == playerId);
        state[roomId].playerList[index].isReady = false;
    },


    changeColor(roomId, playerId, color){
        let index = state[roomId].playerList.findIndex((player)=> player.id == playerId);
        state[roomId].playerList[index].color = color;
    },
    changeSpeed(roomId, speed){
        state[roomId].speed = speed;
    },
    changeNbImpo(roomId, nb){
        state[roomId].nbImposteur = nb;
    },
    changeGameDuration(roomId, dur){
        state[roomId].gameDuration = dur;
    },
    changeNbDechet(roomId, nb){
        state[roomId].nbDechets = nb;
    },
    changeMode(roomId, bool){
        state[roomId].modeIncognito = bool;
    },
    

    leaveRoom(roomId, playerId){
        let index = state[roomId].playerList.findIndex((player)=> player.id == playerId);
        console.log(index);
        state[roomId].playerList.splice(index, 1);
    },

    getNbReady(roomId){
        return state[roomId].playerList.filter((player)=>player.isReady === true).length;
    },

    getNbPlayer(roomId){
        return state[roomId].playerList.length;
    },

    getGameStatus(roomId){
        return state[roomId].gameStatus;
    },

    setGameStatus(roomId, status){
        state[roomId].gameStatus = status;
    },
    destroy(roomId){
        state[roomId] = undefined;
        rooms[roomId] = undefined;
    },

    generateImposteur(roomId){
        let nbJoueur = this.getNbReady(roomId);//nombre de joueur dans la partie
        let imposteur = entierAleatoire(0,nbJoueur-1);
        if(state[roomId].nbImposteur>=nbJoueur){
            state[roomId].playerList[imposteur].isImposteur = true;
            //console.log('plus d\'impo que de joueur')
            return 1;
        }
        //console.log('nombre impo :'+ state[roomId].nbImposteur );
        for(let i = 0; i<state[roomId].nbImposteur; i++){
            //console.log('generation des impos'+ imposteur)
            do{
            state[roomId].playerList[imposteur].isImposteur = true;
            imposteur = entierAleatoire(0,nbJoueur-1);
            }     
            while(state[roomId].playerList[imposteur].isImposteur);
        }
        //console.log(state[roomId].playerList)
    }

}

function generateId() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = '#';
    let char = ''
    for (let i = 0; i < 5; i++) {
        char = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        code += char;
    }
    return code;
}

function createGameState(id, ownerId, username) {
    return {
        id: id,
        playerList: new Array(),
        gameStatus: false,
        owner: {
            id: ownerId,
            username: username
        },
        speed: 1,
        nbImposteur: 1,
        nbDechets:30,
        gameDuration:10,
        modeIncognito: false
    }
}

function entierAleatoire(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}