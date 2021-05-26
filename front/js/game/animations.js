const moveAnimate = (keys,player,p)=>{
    const moveKeys=['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp','KeyW', 'KeyA', 'KeyS', 'KeyD'];
    if (keys.some((key)=>moveKeys.includes(key)) && !p.stop && !p.inReunion){
        player.anims.play(p.color+'Running',true);
        //console.log(player)
        if (p.walkSound.paused)startWalkSound(p.walkSound);
    }
    else if ((!keys.some((key)=>moveKeys.includes(key)) || p.stop ||p.inReunion) && !p.kicking){
        player.anims.play(p.color+'Iddle',true)
        stopWalkSound(p.walkSound);
    }
}
