//import Phaser from 'phaser';
const playerImg = '../assets/player.png';
const mapImg = '../assets/carte.png';


const PLAYER_SPRITE_WIDTH = 84
const PLAYER_SPRITE_HEIGHT = 128
const PLAYER_SPRITE_STARTX = 330
const PLAYER_SPRITE_STARTY = 10
const PLAYER_HEIGHT = 60
const PLAYER_WIDTH = 40
const MAP_HEIGHT = 1100
const MAP_WIDTH = 950
const MAP_ZOOM = 4


const player={};
let keys = [];
//creating gamemode
const currentGame = new GameMode(6);


class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {   
        //Loading map background
        this.load.image('map', mapImg);
        //Loading player spritesheet
        this.load.spritesheet('player',playerImg, {
            frameWidth : PLAYER_SPRITE_WIDTH,
            frameHeight : PLAYER_SPRITE_HEIGHT
        });
    }
      
    create ()
    {
        //Map display
        const map = this.add.image(0, 0, 'map');       
        map.displayHeight=MAP_HEIGHT*MAP_ZOOM;
        map.displayWidth=MAP_WIDTH*MAP_ZOOM;
        //Player Display
        player.sprite = this.add.sprite(PLAYER_SPRITE_STARTX, PLAYER_SPRITE_STARTY, 'player');
        player.sprite.displayHeight=PLAYER_HEIGHT;
        player.sprite.displayWidth=PLAYER_WIDTH;
 
        //Player Animation
        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNumbers('player'),
            frameRate: 24,
            reapeat: -1,
          });

        //Move with keys
        this.input.keyboard.on("keydown" , (key)=>{ 
            if(!keys.includes(key.code)){
                keys.push(key.code);
            }
        })
        this.input.keyboard.on("keyup" , (key)=>{
            keys = keys.filter((touche)=>touche != key.code);
        })        

    }

    update()
    {
        //Camera always centered on player
        this.scene.scene.cameras.main.centerOn(player.sprite.x,player.sprite.y);
        //Move player when appropriate keys are pressed
        movePlayer(keys,player.sprite,currentGame);
        //Animate player sprite
        moveAnimate(keys, player.sprite);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1000,
    height: 600,
    scene: MyGame
};

const game = new Phaser.Game(config);

