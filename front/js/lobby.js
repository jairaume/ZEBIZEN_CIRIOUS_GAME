const gameId = document.getElementById('gameId'); 


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



