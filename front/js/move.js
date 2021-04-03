const movePlayer = (keys,player,currentGame)=>{
    let playerSpeed = currentGame.getSpeed();
    if (keys.includes('ArrowUp') || keys.includes('KeyW')){
        player.y-=playerSpeed;
    }
    if (keys.includes('ArrowDown') || keys.includes('KeyS')){
        player.y+=playerSpeed;
    }    
    if (keys.includes('ArrowLeft') || keys.includes('KeyA')){
        player.x-=playerSpeed;
        player.flipX = true;
    }    
    if (keys.includes('ArrowRight') || keys.includes('KeyD')){
        player.x+=playerSpeed;
        player.flipX = false;
    }   

}