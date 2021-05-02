const leaveBtn = document.getElementById('leave');

const gameId = document.getElementById('gameId');
const players = document.getElementById('players');


const readyBtn = document.getElementById('readyBtn');
let ready = false;

const speedRange = document.getElementById('speedRange');

const speedOutput = document.getElementById('speed');
speedOutput.value = speedRange.value;

let nbReady;

const colorSelector = document.getElementById('color');
const leftColor = document.getElementById('left');
const rightColor = document.getElementById('right');
const colors = [
    '#c51111',
    '#132ed1',
    '#117f2d',
    '#ed54ba',
    '#ef7d0e',
    '#f6f658',
    '#3f474e',
    '#d6e0f0',
    '#6b31bc',
    '#71491e',
    '#38fedb',
];
let color = Math.floor(Math.random() * 11);
colorSelector.style.background = colors[color];
/*****************Reload*******************/

socket.on('reload', ()=>{
    document.location.reload();
});

/*****************New Connection********************/
let roomInfos, clientId;

socket.emit('getRoomInfo');
socket.on('roomInfo', (data) => {
    roomInfos = data;
    if(clientId==undefined)clientId = data.me;
    salonAudio();
    showId(data.id);
    joueurListDisplay();
    initReady();
});
socket.on('newInfo', (data) => {
    roomInfos = data;
    console.log(roomInfos);
    salonAudio();
    joueurListDisplay();
});

/**********LEAVE BUTTON********/
leaveBtn.addEventListener('mouseup',()=>{
    socket.emit('leave');
});
socket.on('leave',(playerId)=>{
    if(playerId == clientId){
        socket.emit('leave',clientId);
    }
})
/********Player List *********/

function joueurListDisplay() {
    players.innerHTML = '';

    for (const player of roomInfos.playerList) {

        let playerDiv = document.createElement('div');
        playerDiv.setAttribute('playerId', player.id);
        playerDiv.classList.add("player");
        if (player.isReady) {
            playerDiv.classList.add("ready");
        }
        if (player.isOwner) {
            playerDiv.classList.add("owner");
        }

        let playerName = document.createElement('b');
        playerName.textContent = player.username;
        playerDiv.appendChild(playerName);

        if (clientId === roomInfos.owner.id && player.id !== roomInfos.owner.id) {
            let kickBtn = document.createElement('i');
            kickBtn.classList.add("fas");
            kickBtn.classList.add("fa-times");

            kickBtn.addEventListener('mouseup', event=>{
                socket.emit('leave-query',player.id);
            });

            playerDiv.appendChild(kickBtn);
        }

        players.appendChild(playerDiv);
    }
}

/**********************CHAT**********************/

/*******************GAME CODE**********************/
gameId.addEventListener('click', () => {
    let copyText = document.getElementById("code");
    copyText.select();
    document.execCommand("copy");
    gameId.getElementsByTagName('i')[0].style.background = '#f9f9f9';
    gameId.getElementsByTagName('i')[0].style.color = '#383838';
    let tmp = gameId.firstElementChild.value;
    gameId.firstElementChild.value = "copié !";
    setTimeout(() => {
        gameId.firstElementChild.value = tmp;
    }, 3000);
});
gameId.getElementsByTagName('i')[0].addEventListener('mouseenter', () => {
    gameId.getElementsByTagName('i')[0].style = '';
})

function showId(id) {
    gameId.firstElementChild.value = id;
}



/*******************READYYY*****************/
readyBtn.addEventListener('mouseup', updateReady)

function updateReady(){
    let index = roomInfos.playerList.findIndex((p)=> p.id == clientId);
    if (roomInfos.playerList[index].isReady == true){
        socket.emit('not-ready');
        ready=false;
    }
    else{
        socket.emit('ready');
        ready=true;
    }
    //AFFICHAGE DU BOUTTON
    readyBtnDisplay();
}

function initReady(){
    let index = roomInfos.playerList.findIndex((p)=> p.id == clientId);
    ready = (roomInfos.playerList[index].isReady == true)? true: false;

    //AFFICHAGE DU BOUTTON
    readyBtnDisplay();
}

socket.on('toggle-ready',(readyId)=>{
    let div = players.querySelector("[playerid ="+ readyId+"]");
    let index = roomInfos.playerList.findIndex((p)=> p.id == readyId);
    roomInfos.playerList[index].isReady = roomInfos.playerList[index].isReady ? false : true;
    div.classList.toggle('ready');

    
    let readyNbDiv = document.getElementById("readyPlayers");
    nbReady = roomInfos.playerList.filter((player)=>player.isReady === true).length;
    readyNbDiv.textContent = nbReady;
})

function readyBtnDisplay(){
    readyBtn.classList.toggle('ready')
    if(!ready)readyBtn.classList.remove('ready');
}

/**************************SETTINGS*****************/
speedRange.oninput = function () {
    speedOutput.value = this.value;
}
speedOutput.oninput = function () {
    speedRange.value = this.value;
}

leftColor.addEventListener('click', () => {
    color = color == 0 ? 10 : color - 1;
    colorSelector.style.background = colors[color];
});
rightColor.addEventListener('click', () => {
    color = color == 10 ? 0 : color + 1;
    colorSelector.style.background = colors[color];
});



/**************AUDIO*******************************/
let moveaudio = new Audio('../audio/salon.mp3');
moveaudio.volume = .1;
function salonAudio() {
    moveaudio.play();
}


/**************************************************/