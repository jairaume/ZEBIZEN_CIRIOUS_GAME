const leaveBtn = document.getElementById('leave');

const gameId = document.getElementById('gameId');
const players = document.getElementById('players');
let playerUsername ='';

const chat = document.getElementById("messages");
const chatForm = document.getElementById('newMessage')
const chatInput = document.getElementById("chatInput")
const chatSend = document.getElementById("chatSend")
let message = '';
let messageUser = '';

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
    {hex: '#4d4d4d', name:'black'},
    {hex: '#4d92bc', name:'blue'},
    {hex: '#50b8b6', name:'cyan'},
    {hex: '#4dbc97', name:'dGreen'},   
    {hex: '#9fbc4d', name:'green'},
    {hex: '#fdc760', name:'yellow'},
    {hex: '#834d4a', name:'brown'},
    {hex: '#bc4d4f', name:'red'},
    {hex: '#fd6069', name:'rose'},
    {hex: '#bbbbbb', name:'white'},
];

let color = Math.floor(Math.random() * colors.length);
colorSelector.style.background = colors[color].hex;
socket.emit('color',colors[color].name)

/****/
let now = new Date();
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
    //salonAudio();
    showId(data.id);
    joueurListDisplay();
    initReady();
});
socket.on('newInfo', (data) => {
    roomInfos = data;
    console.log(roomInfos);
    //salonAudio();
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
        if(clientId == player.id) playerUsername = player.username
        

        players.appendChild(playerDiv);
    }
}

/**********************CHAT**********************/
chatForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    message = chatInput.value;
    chatInput.value = '';
    socket.emit('new-message',message);
});

socket.on('message', (data)=>{
    now = new Date()
    message = data.message;
    messageUser = data.username;
    console.log(data);
    if (messageUser != playerUsername){
        receiveSound();
    }
    else sendSound();

    let item = document.createElement('li');
    let messageUsername = document.createElement('h6')
    let messageHour = document.createElement('span')
    messageHour.classList.add('hour');
    messageHour.innerHTML += (now.getHours()>10 ? '':'0') + now.getHours()+':'
    messageHour.innerHTML += (now.getMinutes()>10 ? '':'0') + now.getMinutes()
    
    messageUsername.innerHTML = messageUser
    messageUsername.appendChild(messageHour);
    
    let messageText = document.createElement('p')
    messageText.innerHTML = message
    item.appendChild(messageUsername)
    item.appendChild(messageText)
    chat.appendChild(item);
    chat.scrollTop = chat.scrollHeight;
})
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
    color = color == 0 ? colors.length-1 : color - 1;
    colorSelector.style.background = colors[color].hex;
    socket.emit('color',colors[color].name)
});
rightColor.addEventListener('click', () => {
    color = color == colors.length-1 ? 0 : color + 1;
    colorSelector.style.background = colors[color].hex;
    socket.emit('color',colors[color].name)
});



/**************AUDIO*******************************/
let moveAudio = new Audio('../audio/salon.mp3');
moveAudio.volume = .1;
function salonAudio() {
    moveAudio.play();
}

let receiveAudio = new Audio('../audio/receive-audio.mp3');
receiveAudio.volume = .5;
function receiveSound(){
    receiveAudio.play();
}


let sendAudio = new Audio('../audio/send-audio.mp3');
sendAudio.volume = .1;
function sendSound() {
    sendAudio.play();
}


/**************************************************/