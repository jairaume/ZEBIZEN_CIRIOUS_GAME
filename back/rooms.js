const state = [];
const rooms = new Array();


module.exports = {
    newRoom(playerId){
        console.log("Creation d'un salon");    
        let roomId='';

        do{
            roomId = generateId()
        }
        while(rooms.find(room=>{room === roomId}))

        rooms[playerId] = roomId;
       
        state[roomId] = createGameState(roomId, playerId);
    
        return roomId;
    },

    joinRoom(roomId,playerId){
        if(state[roomId] != undefined){
            if(!state[roomId].playerList.includes(playerId)){
                state[roomId].playerList.push(playerId);
            }
            return 1;
        }
        else{
            return 0;
        }
    },

    getData(roomId){
        return state[roomId];
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

function createGameState(id,owner){
    return {
        id: id,
        playerList: new Array(),
        gameStatus: false,
        owner: owner
    }
}