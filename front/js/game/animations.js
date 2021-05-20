const moveAnimate = (keys,player,p)=>{
    const moveKeys=['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp','KeyW', 'KeyA', 'KeyS', 'KeyD'];
    if (keys.some((key)=>moveKeys.includes(key)) && !player.anims.isPlaying){
        player.play('running');
        if (p.walkSound.paused)startWalkSound(p.walkSound);
    }
    else if (!keys.some((key)=>moveKeys.includes(key)) && player.anims.isPlaying){
        player.stop('running');
        player.setFrame(11);
        stopWalkSound(p.walkSound);
    }
}