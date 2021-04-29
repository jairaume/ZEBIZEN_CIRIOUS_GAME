const gameId = document.getElementById('gameId'); 

const readyBtn = document.getElementById('readyBtn');
let ready = false;

const speedRange = document.getElementById('speedRange');

const speedOutput = document.getElementById('speed');
speedOutput.value = speedRange.value;

const colorSelector = document.getElementById('color');
const leftColor = document.getElementById('left');
const rightColor = document.getElementById('right');
const colors = [
    '#006400',
    '#00008b',
    '#b03060',
    '#ff0000',
    '#ffd700',
    '#7fff00',
    '#00ffff',
    '#ff00ff',
    '#6495ed',
    '#ffdab9',
];
let color = Math.floor(Math.random()*10);
colorSelector.style.background = colors[color];

/*******************GAME CODE**********************/
gameId.addEventListener('click',()=>{
    let copyText = document.getElementById("code");
    copyText.select();
    document.execCommand("copy");
    gameId.getElementsByTagName('i')[0].style.background = '#f9f9f9';
    gameId.getElementsByTagName('i')[0].style.color = '#383838';
    let tmp = gameId.firstElementChild.value;
    gameId.firstElementChild.value = "copié !";
    setTimeout(()=>{
        gameId.firstElementChild.value = tmp;
    },3000);
});
gameId.getElementsByTagName('i')[0].addEventListener('mouseenter',()=>{
    gameId.getElementsByTagName('i')[0].style = '';
})

function showId(id){
    gameId.firstElementChild.value = id;
}
/**********PLAYER LIST AND READINESS*****************/
readyBtn.addEventListener('mouseup',()=>{
    readyBtn.classList.toggle('ready')
    ready = ready ? false : true;
});
/**************************SETTINGS*****************/
speedRange.oninput = function(){
    speedOutput.value = this.value;
}
speedOutput.oninput = function(){
    speedRange.value = this.value;
}

leftColor.addEventListener('click',()=>{
    color = color==0 ? 9 : color-1;
    colorSelector.style.background = colors[color];
});
rightColor.addEventListener('click',()=>{
    color = color==9 ? 0 : color+1;
    colorSelector.style.background = colors[color];
});



/**************AUDIO*******************************/
let moveaudio = new Audio('../audio/salon.mp3');
moveaudio.volume=.1;
function salonAudio(){
    moveaudio.play();
}
/**************************************************/
socket.emit('getRoomInfo');
socket.on('roomInfo',(data) => {
    console.log(data);
    salonAudio();
    showId(data.id);
})