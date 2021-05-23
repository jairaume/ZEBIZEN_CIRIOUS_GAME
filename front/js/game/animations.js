const moveAnimate = (keys,player,p)=>{
    const moveKeys=['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp','KeyW', 'KeyA', 'KeyS', 'KeyD'];
    if (keys.some((key)=>moveKeys.includes(key))){
        player.anims.play(p.color+'Running',true);
        if (p.walkSound.paused)startWalkSound(p.walkSound);
    }
    else if (!keys.some((key)=>moveKeys.includes(key))){
        player.anims.play(p.color+'Iddle',true)
        stopWalkSound(p.walkSound);
    }
}