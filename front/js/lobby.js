/**************AUDIO*******************************/
let moveaudio = new Audio('../audio/salon.mp3');
moveaudio.volume=1;
function salonAudio(){
    moveaudio.play();
}
/**************************************************/
socket.emit('getRoomInfo');

socket.on('roomInfo',(data) => {
    console.log(data);
    salonAudio();
})

