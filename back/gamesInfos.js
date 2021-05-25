const gamesInfos = [];

module.exports = {
    addGame(gameId){
        if(!gamesInfos[gameId]){
            gamesInfos[gameId] = {
                id: gameId,
                playerList: new Array(),
                garbage : 0,
            }
        }
    },
    returnGarbageNumber(gameId){
        return gamesInfos[gameId].garbage;
    },
    increaseGarbage(gameId){
        gamesInfos[gameId].garbage+=1;
    },
    decreaseGarbage(gameId){/*
        if(gamesInfos[gameId].garbage){
            if(gamesInfos[gameId].garbage > 0 ) {
                gamesInfos[gameId].garbage-=1;
            }
        }*/
    },
    getGameInfos(gameId){
        return gamesInfos[gameId] != undefined?gamesInfos[gameId]:0;
    },

    addPlayer(gameId, playerId, username){
        if(!gamesInfos[gameId]){
            return 0;
        }
        if(!gamesInfos[gameId].playerList[playerId]){
            gamesInfos[gameId].playerList[playerId] = {
                id: playerId,
                username: username,
            }
            return 1;
        }else{
            return 0;
        }
    },
    isPlayerInGame(gameId,playerId){
        return gamesInfos[gameId].playerList[playerId]?true:false;
    },

    setPoubelles(gameId, bins){
        if(!gamesInfos[gameId]){
            return 0;
        }
        gamesInfos[gameId].bins = bins;
    },

    getPoubelles(gameId){
        if(!gamesInfos[gameId]){
            return 0;
        }
        if(!gamesInfos[gameId].bins){
            return 0;
        }

        return gamesInfos[gameId].bins;
    },

    setPoubelleUnknowAttribute(gameId,color,value){
        gamesInfos[gameId].bins[color].unknow = value;
    },

    exist(gameId){
        return gamesInfos[gameId] != undefined;
    },

    reverseBin(gameId, poubelleColor, angle){
        gamesInfos[gameId].bins[poubelleColor].angle = angle;
    }
}