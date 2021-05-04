import {mapBounds} from './mapBounds.js'

const MAP_WIDTH = 1392
const MAP_HEIGHT = 1120

function moveIsPossible  (x,y){
    
    if (!mapBounds[y]){
        return true;
    }
    else{        
        return !mapBounds[y].includes(x);
    }
}

class Player{
    constructor(id, container, name, color, imposteur = false) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.imposteur = this.imposteur;

        this.container = container;
    }
    

    move(keys,currentGame) {
        let playerSpeed = currentGame.getSpeed();
        let playerMoved = false;
        let absPlayer = {x: Math.floor(this.container.x/5 + (MAP_WIDTH)/2), y: Math.floor(this.container.y/5 + (MAP_HEIGHT)/2)+5}
        if (((keys.includes('ArrowUp') || keys.includes('KeyW'))&&((keys.includes('ArrowLeft') || keys.includes('KeyA'))))||
        ((keys.includes('ArrowUp') || keys.includes('KeyW'))&&((keys.includes('ArrowRight') || keys.includes('KeyD'))))||
        ((keys.includes('ArrowDown') || keys.includes('KeyS'))&&((keys.includes('ArrowLeft') || keys.includes('KeyA'))))||
        ((keys.includes('ArrowDown') || keys.includes('KeyS'))&&((keys.includes('ArrowRight') || keys.includes('KeyD'))))){
            playerSpeed = playerSpeed/1.414;
        }
        if ((keys.includes('ArrowUp') || keys.includes('KeyW')) && moveIsPossible(absPlayer.x, absPlayer.y - 3)) {
            this.container.y -= playerSpeed;
            playerMoved = true;
        }
        if ((keys.includes('ArrowDown') || keys.includes('KeyS')) && moveIsPossible(absPlayer.x, absPlayer.y + 3)) {
            this.container.y += playerSpeed;
            playerMoved = true;

        }
        if ((keys.includes('ArrowLeft') || keys.includes('KeyA')) && moveIsPossible(absPlayer.x - 5, absPlayer.y )) {
            this.container.x -= playerSpeed;
            this.container.getByName('sprite').flipX = true;
            playerMoved = true;

        }
        if ((keys.includes('ArrowRight') || keys.includes('KeyD')) && moveIsPossible(absPlayer.x + 6, absPlayer.y)) {
            this.container.x += playerSpeed;
            this.container.getByName('sprite').flipX = false;
            playerMoved = true;

        }
        return playerMoved;
    }

}

export {Player};
