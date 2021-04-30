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
            isOwner:  playerId === state[roomId].owner.id?true:false,
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
        }
    }
}