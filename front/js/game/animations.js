let walkAudio = new Audio('../audio/walk-audio.mp3');
walkAudio.volume = .2;
function walkSound(){
    walkAudio.play();
}


const moveAnimate = (keys,player)=>{
    const moveKeys=['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp','KeyW', 'KeyA', 'KeyS', 'KeyD'];
    if (keys.some((key)=>moveKeys.includes(key)) && !player.anims.isPlaying){
        player.play('running');
    }
    else if (!keys.some((key)=>moveKeys.includes(key)) && player.anims.isPlaying){
        player.stop('running');
        player.setFrame(11);
    }
}