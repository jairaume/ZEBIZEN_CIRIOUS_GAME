//import Phaser from 'phaser';
const playerImg = '../../assets/player.png';
const mapImg = '../../assets/carte.png'

import { Player } from './class_PLAYER.js'
import { generateSpawnPositions} from './generateSpawnPositions.js'

const PLAYER_SPRITE_WIDTH = 84
const PLAYER_SPRITE_HEIGHT = 128
const PLAYER_SPRITE_STARTX = 330
const PLAYER_SPRITE_STARTY = 10
const PLAYER_HEIGHT = 60
const PLAYER_WIDTH = 40
const MAP_HEIGHT = 1100
const MAP_WIDTH = 950
const MAP_ZOOM = 3

let clientId;

let otherPlayer = new Array();
let player;
let roomInfos;
let keys = [];
let spawnPositions;
//creating gamemode
const currentGame = new GameMode(8);


class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        //Loading map background
        this.load.image('map', mapImg);


        //Loading player spritesheet
        this.load.spritesheet('player', playerImg, {
            frameWidth: PLAYER_SPRITE_WIDTH,
            frameHeight: PLAYER_SPRITE_HEIGHT
        });
        //Loading other player spritesheet
        this.load.spritesheet('otherPlayer', playerImg, {
            frameWidth: PLAYER_SPRITE_WIDTH,
            frameHeight: PLAYER_SPRITE_HEIGHT
        });
    }

    create() {
        //Map display
        const map = this.add.image(0, 0, 'map');
        
        map.displayHeight = MAP_HEIGHT * MAP_ZOOM;
        map.displayWidth = MAP_WIDTH * MAP_ZOOM;
        
        let newContainer = (name,position) => {
            let container = this.add.container(position.x, position.y);

            let textPlayer = this.add.text(0, -45, name)
            textPlayer.x = textPlayer.width / -2
            textPlayer.name = 'text';
            
            container.add(textPlayer);

            let spritePlayer = this.add.sprite(0, 0, 'player')
            spritePlayer.name = 'sprite';
            spritePlayer.displayHeight = PLAYER_HEIGHT;
            spritePlayer.displayWidth = PLAYER_WIDTH;
            spritePlayer.setFrame(10);
            
            container.add(spritePlayer);

            return container;
        }

        let newPlayer = (id, username, color, imposteur = false,position) => {
            let newPlayer = new Player(id, newContainer(username,position), username, color);

            return newPlayer;
        }

        //Récuperation des infos de la session
        socket.emit('getRoomInfo');
        socket.on('roomInfo', (data) => {
            roomInfos = data;
            clientId = data.me;
            console.log(roomInfos.playerList.length);
            spawnPositions = generateSpawnPositions(roomInfos.playerList.length)
            console.log(spawnPositions)
            let i = 0;
            for (const aPlayer of data.playerList) {
                if (aPlayer.id != clientId) {
                    otherPlayer.push(newPlayer(aPlayer.id, aPlayer.username, 'yellow', false,spawnPositions[i]));
                } else {
                    player = newPlayer(aPlayer.id, aPlayer.username, 'blue', false,spawnPositions[i]);
                }
                i++;
            }
        });

        //Player Animation
        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNumbers('player'),
            frameRate: 24,
            reapeat: -1,
        });

        //Move with keys
        this.input.keyboard.on("keydown", (key) => {
            if (!keys.includes(key.code)) {
                keys.push(key.code);
            }
        })
        this.input.keyboard.on("keyup", (key) => {
            keys = keys.filter((touche) => touche != key.code);
        })

        socket.on('move', (data) => {
            let id = data.id;
            let index = otherPlayer.findIndex((player) => player.id == id);
            if (data.x < otherPlayer[index].container.x) {
                otherPlayer[index].container.getByName('sprite').flipX = true;
            }
            else if (data.x > otherPlayer[index].container.x) {
                otherPlayer[index].container.getByName('sprite').flipX = false;
            }
            otherPlayer[index].container.x = data.x;
            otherPlayer[index].container.y = data.y;
            otherPlayer[index].moving = true;
        });
        socket.on('end-move', (id) => {
            let index = otherPlayer.findIndex((player) => player.id == id);
            otherPlayer[index].moving = false;
            otherPlayer[index].container.getByName('sprite').setFrame(11);
        });
    }

    update() {
        if (roomInfos) {


            //Camera always centered on player
            this.scene.scene.cameras.main.centerOn(player.container.x, player.container.y);
            //Move player when appropriate keys are pressed
            let playerMoved = player.move(keys, currentGame);
            if (playerMoved) {
                socket.emit('move', { x: player.container.x, y: player.container.y, id: player.id })
                player.movedLastFrame = true;
            }
            else {
                if (player.movedLastFrame) {
                    socket.emit('end-move', player.id)
                }
                player.movedLastFrame = false;
            }
            //Animate player sprite
            moveAnimate(keys, player.container.getByName('sprite'));
            //Animate other player
            otherPlayer.forEach(p => {
                if (p.moving && !p.container.getByName('sprite').anims.isPlaying) {
                    p.container.getByName('sprite').play('running');
                }
                else if (!p.moving && p.container.getByName('sprite').anims.isPlaying) {
                    p.container.getByName('sprite').stop('running');
                }
            });
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: '100%',
    height: '100%',
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: MyGame
};


const game = new Phaser.Game(config);