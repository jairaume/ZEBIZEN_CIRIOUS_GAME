const gameId = document.getElementById('gameId'); 
const speedRange = document.getElementById('speedRange');
const speedOutput = document.getElementById('speed');
const colorSelector = document.getElementById('color');
speedOutput.value = speedRange.value;
const colors = [
    '#ffe119',
    '#f58231',
    '#000075',
    '#e6194B',
    '#a9a9a9',
    '#aaffc3',
    '#800000',
    '#42d4f4',
    '#469990',
    '#4363d8',
    '#911eb4',
];

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

/**************************SETTINGS*****************/
speedRange.oninput = function(){
    speedOutput.value = this.value;
}
speedOutput.oninput = function(){
    speedRange.value = this.value;
}

colorSelector.oninput = function(){
    let color = colors[this.value];
    let s = document.createElement("style");
    document.head.appendChild(s);
    s.textContent = '.color::-webkit-slider-thumb{background-color:'+color+' }'
}



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