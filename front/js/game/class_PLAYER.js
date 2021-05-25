import { mapBounds } from './mapLayers/mapBounds.js';
import { firstLayer } from './mapLayers/firstLayer.js';
import { secondLayer } from './mapLayers/secondLayer.js';

const MAP_WIDTH = 1392
const MAP_HEIGHT = 1120

function moveIsPossible(x, y) {
    if (!mapBounds[y]) {
        return true;
    }
    else {
        return !mapBounds[y].includes(x);
    }
}
function getPlayerLayer(x, y) {
    if (firstLayer[y]) {
        if (firstLayer[y].includes(x)) {
            return 1;
        }
    }
    if (secondLayer[y]) {
        if (secondLayer[y].includes(x)) {
            return 2;
        }
    }
    return 0;
}

class Player {
    constructor(id, container, name, color, imposteur) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.imposteur = imposteur;
        this.layer = 0;
        this.inReunion = false;
        this.container = container;
        this.walkSound = new Audio('../audio/walk-audio.mp3');
        this.poubelle = false;
        this.recycle = true;

    }


    move(keys, currentGame) {
        if(this.inReunion || this.stop)return
        let playerSpeed = currentGame.getSpeed();
        let playerMoved = false;
        let absPlayer = { x: Math.floor(this.container.x / 5 + (MAP_WIDTH) / 2), y: Math.floor(this.container.y / 5 + (MAP_HEIGHT) / 2) + 5 }
        if (((keys.includes('ArrowUp') || keys.includes('KeyW')) && ((keys.includes('ArrowLeft') || keys.includes('KeyA')))) ||
            ((keys.includes('ArrowUp') || keys.includes('KeyW')) && ((keys.includes('ArrowRight') || keys.includes('KeyD')))) ||
            ((keys.includes('ArrowDown') || keys.includes('KeyS')) && ((keys.includes('ArrowLeft') || keys.includes('KeyA')))) ||
            ((keys.includes('ArrowDown') || keys.includes('KeyS')) && ((keys.includes('ArrowRight') || keys.includes('KeyD'))))) {
            playerSpeed = playerSpeed / 1.414;
        }
        if ((keys.includes('ArrowUp') || keys.includes('KeyW')) && moveIsPossible(absPlayer.x, absPlayer.y - 3)) {
            this.container.y -= playerSpeed;
            playerMoved = true;
        }
        if ((keys.includes('ArrowDown') || keys.includes('KeyS')) && moveIsPossible(absPlayer.x, absPlayer.y + 3)) {
            this.container.y += playerSpeed;
            playerMoved = true;

        }
        if ((keys.includes('ArrowLeft') || keys.includes('KeyA')) && moveIsPossible(absPlayer.x - 5, absPlayer.y)) {
            this.container.x -= playerSpeed;
            this.container.getByName('sprite').flipX = true;
            playerMoved = true;

        }
        if ((keys.includes('ArrowRight') || keys.includes('KeyD')) && moveIsPossible(absPlayer.x + 6, absPlayer.y)) {
            this.container.x += playerSpeed;
            this.container.getByName('sprite').flipX = false;
            playerMoved = true;

        }

        this.layer = getPlayerLayer(absPlayer.x, absPlayer.y);
        switch (this.layer) {
            case 0:
                this.container.setDepth(250);

                break;
            case 1:
                this.container.setDepth(150);

                break;
            case 2:
                this.container.setDepth(50);

                break;
            default:
                this.container.setDepth(250);

        }

        return playerMoved;
    }

    isImposteur(){
        return this.imposteur;
    }

}

export { Player };
