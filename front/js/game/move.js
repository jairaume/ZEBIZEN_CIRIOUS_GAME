import {mapBounds} from './mapBounds.js'

const MAP_WIDTH = 1392
const MAP_HEIGHT = 1120

function moveIsPossible  (x,y){
    console.log('je check')
    if (!mapBounds[y]){
        return true;
    }
    else{
        console.log('NAN')
        return !mapBounds[y].includes(x);
    }
}


const movePlayer = (keys,player,currentGame)=>{
    let playerSpeed = currentGame.getSpeed();
    let playerMoved = false;
    let absPlayer = {x: player.x + MAP_WIDTH/2, y: player.y + MAP_HEIGHT/2}
    if ((keys.includes('ArrowUp') || keys.includes('KeyW')) && moveIsPossible(absPlayer.x, absPlayer.y - playerSpeed)){
        player.y-=playerSpeed;
        playerMoved = true;

    }
    if ((keys.includes('ArrowDown') || keys.includes('KeyS')) && moveIsPossible(absPlayer.x, absPlayer.y + playerSpeed)){
        player.y+=playerSpeed;
        playerMoved = true;

    }    
    if ((keys.includes('ArrowLeft') || keys.includes('KeyA')) && moveIsPossible(absPlayer.x - playerSpeed, absPlayer.y )){
        player.x-=playerSpeed;
        player.getByName('sprite').flipX = true;
        playerMoved = true;

    }    
    if ((keys.includes('ArrowRight') || keys.includes('KeyD')) && moveIsPossible(absPlayer.x + playerSpeed, absPlayer.y)){
        player.x+=playerSpeed;
        player.getByName('sprite').flipX = false;
        playerMoved = true;

    }   
    return playerMoved;
}