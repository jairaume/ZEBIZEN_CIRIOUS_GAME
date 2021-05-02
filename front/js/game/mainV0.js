//import Phaser from 'phaser';
const playerImg = '../assets/player.png';
const mapImg = '../assets/carte.png'



const PLAYER_SPRITE_WIDTH = 84
const PLAYER_SPRITE_HEIGHT = 128
const PLAYER_SPRITE_STARTX = 330
const PLAYER_SPRITE_STARTY = 10
const PLAYER_HEIGHT = 60
const PLAYER_WIDTH = 40
const MAP_HEIGHT = 1100
const MAP_WIDTH = 950
const MAP_ZOOM = 3


let player={};
let otherPlayer={};
let keys = [];
//creating gamemode
const currentGame = new GameMode(8);


class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {   
        //Loading map background
        this.load.image('map',mapImg);


        //Loading player spritesheet
        this.load.spritesheet('player',playerImg, {
            frameWidth : PLAYER_SPRITE_WIDTH,
            frameHeight : PLAYER_SPRITE_HEIGHT
        });
        //Loading other player spritesheet
        this.load.spritesheet('otherPlayer',playerImg, {
            frameWidth : PLAYER_SPRITE_WIDTH,
            frameHeight : PLAYER_SPRITE_HEIGHT
        });
    }
      
    create ()
    {
        //Map display
        const  map = this.add.image(0, 0, 'map');   
        
        map.displayHeight=MAP_HEIGHT*MAP_ZOOM;
        map.displayWidth=MAP_WIDTH*MAP_ZOOM;
        
        //Player Display
        let spritePlayer = this.add.sprite(0,0,'player')
        spritePlayer.name = 'sprite';
        spritePlayer.displayHeight=PLAYER_HEIGHT;
        spritePlayer.displayWidth=PLAYER_WIDTH;
        spritePlayer.setFrame(11);
        player = this.add.container(PLAYER_SPRITE_STARTX,PLAYER_SPRITE_STARTY)
        let textPlayer = this.add.text(0,-45,'Joueur 1')
        textPlayer.x = textPlayer.width/-2
        textPlayer.name = 'text';
        console.log(textPlayer);
        player.add(spritePlayer)
        player.add(textPlayer)

        /*let playerSprite = this.add.sprite(PLAYER_SPRITE_STARTX, PLAYER_SPRITE_STARTY, 'player');
        let playerText = this.add.text(0,0,'Joueur 1')
        playerSprite.displayHeight=PLAYER_HEIGHT;
        playerText.displayWidth=PLAYER_WIDTH;*/

        //Other Display
        spritePlayer = this.add.sprite(0,0,'player')
        spritePlayer.name = 'sprite';
        spritePlayer.displayHeight=PLAYER_HEIGHT;
        spritePlayer.displayWidth=PLAYER_WIDTH;
        spritePlayer.setFrame(11);
        otherPlayer = this.add.container(PLAYER_SPRITE_STARTX,PLAYER_SPRITE_STARTY)
        textPlayer = this.add.text(0,-45,'Joueur 2')
        textPlayer.x = textPlayer.width/-2
        textPlayer.name = 'text';
        otherPlayer.add(spritePlayer)
        otherPlayer.add(textPlayer)
 
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

        socket.on('move',(data)=>{
            if (data.x < otherPlayer.x){
                otherPlayer.getByName('sprite').flipX = true;
            }
            else if(data.x > otherPlayer.x){
                otherPlayer.getByName('sprite').flipX = false;
            }
            otherPlayer.x = data.x;
            otherPlayer.y = data.y;
            otherPlayer.moving = true;
        });
        socket.on('end-move',()=>{
            otherPlayer.moving = false;
            otherPlayer.getByName('sprite').setFrame(11);
        });
    }

    update()
    {
        //Camera always centered on player
        this.scene.scene.cameras.main.centerOn(player.x,player.y);
        //Move player when appropriate keys are pressed
        let playerMoved = movePlayer(keys,player,currentGame);
        if(playerMoved){
            socket.emit('move',{x: player.x,  y: player.y})
            player.movedLastFrame = true;
        }
        else {
            if(player.movedLastFrame){
                socket.emit('end-move')
            }
            player.movedLastFrame = false;
        }
        //Animate player sprite
        moveAnimate(keys, player.getByName('sprite'));
        //Animate other player
        if(otherPlayer.moving && !otherPlayer.getByName('sprite').anims.isPlaying){
            otherPlayer.getByName('sprite').play('running');
        }
        else if(!otherPlayer.moving && otherPlayer.getByName('sprite').anims.isPlaying){
            otherPlayer.getByName('sprite').stop('running');
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: '90vw',
    height: '85vh',
    scene: MyGame
};

const game = new Phaser.Game(config);

