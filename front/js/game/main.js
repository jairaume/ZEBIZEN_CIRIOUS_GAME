//import Phaser from 'phaser';
const playerImg = '../../assets/player.png';
const mapProps = '../../assets/map/map_props.png';
const mapTiles = '../../assets/map/map_tiles.png';



import { Player } from './class_PLAYER.js'
import { generateSpawnPositions } from './generateSpawnPositions.js'
import { generateBins } from './generateBins.js'

const PLAYER_SPRITE_WIDTH = 84
const PLAYER_SPRITE_HEIGHT = 128
const PLAYER_SPRITE_STARTX = -80
const PLAYER_SPRITE_STARTY = 0
const PLAYER_HEIGHT = 60
const PLAYER_WIDTH = 40
const MAP_WIDTH = 1392
const MAP_HEIGHT = 1120
const MAP_ZOOM = 5
const POUBELLE_ZOOM = 0.4

let clientId;

let otherPlayer = new Array();
let player;
let roomInfos;
let keys = [];
let spawnPositions;
let binImg = generateBins();
//creating gamemode
const currentGame = new GameMode(8);


class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const loadingText = this.add.text(screenCenterX, screenCenterY, 'CHARGEMENT...').setOrigin(0.5);
        //Loading map background
        this.load.image('mapT', mapTiles);


        this.load.image('binBlanc', binImg.Blanc.url);
        this.load.image('binMarron', binImg.Marron.url);
        this.load.image('binJaune', binImg.Jaune.url);
        this.load.image('binVert', binImg.Vert.url);
        this.load.image('binBleue', binImg.Bleue.url);
        this.load.image('binViolet', binImg.Violet.url);
        this.load.image('binNoir', binImg.Noir.url);
        this.load.image('binOrange', binImg.Orange.url);
        this.load.image('binRouge', binImg.Rouge.url);


        this.load.image('garbagePile', '../../assets/garbagePile.png');
        this.load.image('garbagePileGlow', '../../assets/garbagePile-glow.png');


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
        this.load.image('mapP', mapProps);
    }

    create() {

        //Map tiles display
        const mapT = this.add.image(0, 0, 'mapT');
        mapT.displayHeight = MAP_HEIGHT * MAP_ZOOM;
        mapT.displayWidth = MAP_WIDTH * MAP_ZOOM;
        mapT.setDepth(1);

        
        //DECHETS
        const garbagePile = this.add
        .image(-70, 0, 'garbagePile')
        .setScale(0.6)
        .setDepth(2)
        .setTexture('garbagePileGlow')


        
        
        //JOUEURS
        let newContainer = (name, position) => {
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
            container.setDepth(2);
            
            return container;
        }
        
        let newPlayer = (id, username, color, imposteur = false, position) => {
            let newPlayer = new Player(id, newContainer(username, position), username, color);
            
            return newPlayer;
        }
        
        //Récuperation des infos de la session
        socket.emit('getRoomInfo');
        socket.on('roomInfo', (data) => {
            roomInfos = data;
            clientId = data.me;
            spawnPositions = generateSpawnPositions(roomInfos.playerList.length)
            let i = 0;
            for (const aPlayer of data.playerList) {
                if (aPlayer.id != clientId) {
                    otherPlayer.push(newPlayer(aPlayer.id, aPlayer.username, 'yellow', false, spawnPositions[i]));
                } 
                else {
                    player = newPlayer(aPlayer.id, aPlayer.username, 'blue', false, spawnPositions[i]);
                }
                if(aPlayer.id == clientId && aPlayer.isOwner){
                    console.log('c moi le owner')
                    socket.emit('generate-bins')
                }
                i++;
            }
        });
        
        
        this.input.on(Phaser.Input.Events.POINTER_DOWN, function (pointer) {
            console.log("x: ", player.container.x, " y: ", player.container.y)
        });


        //Map tiles display
        const mapP = this.add.image(0, 0, 'mapP');
        mapP.displayHeight = MAP_HEIGHT * MAP_ZOOM;
        mapP.displayWidth = MAP_WIDTH * MAP_ZOOM;
        mapP.setDepth(10);

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
        
        
        this.scene.scene.cameras.main.setBounds(-MAP_WIDTH * 5 / 2, -MAP_HEIGHT * 5 / 2, (MAP_WIDTH * MAP_ZOOM), (MAP_HEIGHT * MAP_ZOOM))
        
        this.minimap = this.cameras.add(5, 5, MAP_WIDTH / 5, MAP_HEIGHT / 5)
        this.minimap.setZoom(0.08)
        this.minimap.setBackgroundColor(0x002244);
        this.minimap.setName('mini');
        //this.minimap.ignore(otherPlayer);
        this.minimap.setLerp(0.1)
        
        
        //POUBELLE
        //socket.emit('generate-bins','');
        socket.on('generate-bins',(bins)=>{
            console.log("je genere la en gros")
            let allBins = [];
            for(const bin in binImg){
                let color = bins[bin].color;
                let tmpBin = this.add.image(bins[color].x, bins[color].y, 'bin' + bins[color].color)
                if(bins[color].flip)tmpBin.flipX = true;
                allBins.push(tmpBin)
                console.log(allBins);
    
            }
            for (const bin of allBins) {
                bin.displayHeight = 200 * POUBELLE_ZOOM;
                bin.displayWidth = 125 * POUBELLE_ZOOM;
                bin.pixelArt = true;
                bin.setDepth(30)
            }
        });
        //this.enable([garbagePile,player], Phaser.Physics.ARCADE);
    }
    
    update() {
        if (roomInfos) {


            //Camera always centered on player
            this.minimap.startFollow(player.container,true, 0.5, 0.5)
            this.scene.scene.cameras.main.startFollow(player.container);
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
        //this.physics.arcade.collide(garbagePile, player, collisionHandler, null, this);
    }

    /*render(){
        this.debug.body(garbagePile);
        this.debug.body(player);
    }*/
}

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: '100%',
    height: '100%',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: MyGame,
};


const game = new Phaser.Game(config);