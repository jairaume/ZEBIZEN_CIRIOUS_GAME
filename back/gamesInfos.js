const gamesInfos = [];

module.exports = {
    addGame(gameId) {
        if (!gamesInfos[gameId]) {
            gamesInfos[gameId] = {
                id: gameId,
                playerList: new Array(),
                garbage: 0,
                allVote: []
            }
        }
    },
    returnGarbageNumber(gameId) {
        return gamesInfos[gameId].garbage;
    },
    increaseGarbage(gameId) {
        //console.log("gamesInfos[gameId].garbage ++")
        gamesInfos[gameId].garbage += 1;
    },
    decreaseGarbage(gameId) {
        if (gamesInfos[gameId].garbage > 0) {
            //console.log("gamesInfos[gameId].garbage --")
            gamesInfos[gameId].garbage -= 1;
        }
    },
    getGameInfos(gameId) {
        return gamesInfos[gameId] != undefined ? gamesInfos[gameId] : 0;
    },

    addPlayer(gameId, playerId, username,impo) {
        if (!gamesInfos[gameId]) {
            return 0;
        }
        if (!gamesInfos[gameId].playerList[playerId]) {
            gamesInfos[gameId].playerList[playerId] = {
                id: playerId,
                username: username,
                imposteur: impo,
                dead: false,
            }
            return 1;
        } else {
            return 0;
        }
    },
    isPlayerInGame(gameId, playerId) {
        return gamesInfos[gameId].playerList[playerId] ? true : false;
    },

    setPoubelles(gameId, bins) {
        if (!gamesInfos[gameId]) {
            return 0;
        }
        gamesInfos[gameId].bins = bins;
    },

    getPoubelles(gameId) {
        if (!gamesInfos[gameId]) {
            return 0;
        }
        if (!gamesInfos[gameId].bins) {
            return 0;
        }

        return gamesInfos[gameId].bins;
    },

    setPoubelleUnknowAttribute(gameId, color, value) {
        //console.log(gamesInfos[gameId].bins);
        gamesInfos[gameId].bins[color].unknow = value;
    },

    exist(gameId) {
        return gamesInfos[gameId] != undefined;
    },

    reverseBin(gameId, poubelleColor, angle) {
        gamesInfos[gameId].bins[poubelleColor].angle = angle;
    },

    addVote(gameId, vote) {
        gamesInfos[gameId].allVote.push(vote);
    },
    getAllVotes(gameId) {
        return gamesInfos[gameId].allVote;
    },
    resetAllVotes(gameId) {
        gamesInfos[gameId].allVote = [];
    },

    setDead(gameId, playerId) {
        for (const p in gamesInfos[gameId].playerList) {
            if (gamesInfos[gameId].playerList[p].id == playerId) {
                gamesInfos[gameId].playerList[p].dead = true;
                return 1;
            }
        }
    },
    getNbAlivePlayer(gameId) {
        let count = 0;
        for (const p in gamesInfos[gameId].playerList) {
            if (!gamesInfos[gameId].playerList[p].dead) count++;
        }
        return count;
    },
    isOnlyImposteurInlive(gameId){
        let count = 0;
        for (const p in gamesInfos[gameId].playerList) {
            if (!gamesInfos[gameId].playerList[p].dead && !gamesInfos[gameId].playerList[p].imposteur) count++;
        }
        return count?false:true;
    },

    elementFrequent(gameId, tableau) {
        let resultat = [];

        for (const player in gamesInfos[gameId].playerList ) {

            let mem = (tableau.filter(vote =>vote ==player))
            resultat.push(
                {nbVote: mem.length,
                id: player,
                }
            )
        }

        let plusVote= {
            nbVote: 0,
            id: 0
        }
        for (const vote of resultat) {
            if(plusVote.nbVote < vote.nbVote){
                plusVote.nbVote = vote.nbVote;
                plusVote.id = vote.id;
            }
        }

        for (const vote of resultat) {
            if(plusVote.nbVote == vote.nbVote && plusVote.id != vote.id){

                return 0;
            }
        }


        return plusVote.id;

    },
    destroyGame(gameId){
        gamesInfos[gameId] = undefined;
    }
}


