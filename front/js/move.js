const movePlayer = (keys,player,currentGame)=>{
    let playerSpeed = currentGame.getSpeed();
    let playerMoved = false;
    if (keys.includes('ArrowUp') || keys.includes('KeyW')){
        player.y-=playerSpeed;
        playerMoved = true;

    }
    if (keys.includes('ArrowDown') || keys.includes('KeyS')){
        player.y+=playerSpeed;
        playerMoved = true;

    }    
    if (keys.includes('ArrowLeft') || keys.includes('KeyA')){
        player.x-=playerSpeed;
        player.flipX = true;
        playerMoved = true;

    }    
    if (keys.includes('ArrowRight') || keys.includes('KeyD')){
        player.x+=playerSpeed;
        player.flipX = false;
        playerMoved = true;

    }   
    return playerMoved;
}