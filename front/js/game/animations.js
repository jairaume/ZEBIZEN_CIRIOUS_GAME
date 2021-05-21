const moveAnimate = (keys,player,p)=>{
    const moveKeys=['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp','KeyW', 'KeyA', 'KeyS', 'KeyD'];
    if (keys.some((key)=>moveKeys.includes(key)) && !player.anims.isPlaying){
        console.log('course')
        player.anims.play('running',true);
        if (p.walkSound.paused)startWalkSound(p.walkSound);
    }
    else if (!keys.some((key)=>moveKeys.includes(key)) && player.anims.keys == 'running'){
        console.log('stop course')
        player.stop('running');
        player.setFrame(4)
        player.anims.play('iddle',true)
        stopWalkSound(p.walkSound);
    }
}