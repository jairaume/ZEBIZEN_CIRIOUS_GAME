const username = document.getElementById('username')
const createBtn = document.getElementById('createBtn')
const gameId = document.getElementById('gameId')
const joinBtn = document.getElementById('joinBtn')
const form = document.getElementById('formLogin');


form.addEventListener('submit', event => {
    console.log('Connection')
    event.preventDefault();
    logger.connexion(username.value, gameId.value);
});


/*createBtn.addEventListener('click',createGame);
joinBtn.addEventListener('click', joinGame);

function createGame(){
    console.log("Creation d'un salon");
    socket.emit('new-game',username.value);
    
}

function joinGame(){
    console.log("Rejoindre une partie");
    const code = gameId.value;
    socket.emit('join-game',code,username.value);
}
*/

