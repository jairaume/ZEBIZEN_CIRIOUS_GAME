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
        if (keys.includes('ArrowUp') || keys.includes('KeyW')) {
            this.container.y -= playerSpeed;
            playerMoved = true;

        }
        if (keys.includes('ArrowDown') || keys.includes('KeyS')) {
            this.container.y += playerSpeed;
            playerMoved = true;

        }
        if (keys.includes('ArrowLeft') || keys.includes('KeyA')) {
            this.container.x -= playerSpeed;
            this.container.getByName('sprite').flipX = true;
            playerMoved = true;

        }
        if (keys.includes('ArrowRight') || keys.includes('KeyD')) {
            this.container.x += playerSpeed;
            this.container.getByName('sprite').flipX = false;
            playerMoved = true;

        }
        return playerMoved;
    }

}

export {Player};
