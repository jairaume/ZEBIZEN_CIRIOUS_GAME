let walkAudio = new Audio('../audio/walk-audio.mp3');
walkAudio.loop = true;
walkAudio.volume = .5;
function startWalkSound(){
    console.log('start walk')
    walkAudio.play();
}
function stopWalkSound(){
    console.log('stop walk')
    walkAudio.pause();
}

function getDistance(xa,ya,xb,yb){
    return Math.sqrt((xb-xa)**2+(yb-ya)**2)
}
function getVolume(d){
    return d > 600 ? 0 : 0.5-(0.5*(d/600))
}


const moveAnimate = (keys,player)=>{
    const moveKeys=['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp','KeyW', 'KeyA', 'KeyS', 'KeyD'];
    if (keys.some((key)=>moveKeys.includes(key)) && !player.anims.isPlaying){
        player.play('running');
        if (walkAudio.paused)startWalkSound();
    }
    else if (!keys.some((key)=>moveKeys.includes(key)) && player.anims.isPlaying){
        player.stop('running');
        player.setFrame(11);
        stopWalkSound();
    }
}