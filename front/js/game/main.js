//import Phaser from 'phaser';
const playerImg = '../../assets/player.png';
const mapProps = '../../assets/map/map_props.png';
const mapTiles = '../../assets/map/map_tiles.png';



import { Player } from './class_PLAYER.js'
import { generateSpawnPositions } from './generateSpawnPositions.js'
import { generateBins } from './generateBins.js'
import { getDistance } from './getDistance.js'
import { dechet } from './dechets.js'
import { dechets } from './dechets.js'
import CountdownController from './countdownTimer.js'
import { imposteur } from './imposteur.js'


const PLAYER_SPRITE_WIDTH = 84
const PLAYER_SPRITE_HEIGHT = 128
const PLAYER_SPRITE_STARTX = -80
const PLAYER_SPRITE_STARTY = 0
const PLAYER_HEIGHT = 80
const PLAYER_WIDTH = 80
const MAP_WIDTH = 1392
const MAP_HEIGHT = 1120
const MAP_ZOOM = 5
const POUBELLE_ZOOM = 0.4

let clientId;

let otherPlayer = new Array();
let player;
let garbagePile;
let roomInfos;
let gameInfos;
let allBins = [];
let keys = [];
let trashAudio;
let binAudio;
let spawnPositions;
let binImg = generateBins();
let distance = 0;
let timerLabel;
let timer;
let gameDuration = 10; // seconds
let progressBar;
let progressBox;
//creating gamemode
const currentGame = new GameMode(8);


class MyGame extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const loadingText = this.add.text(screenCenterX, screenCenterY, 'CHARGEMENT DU JEU...').setOrigin(0.5);
        //Loading map background
        this.load.image('mapT', mapTiles);

        //bin textures
        this.load.image('binBlanc', binImg.Blanc.url);
        this.load.image('binMarron', binImg.Marron.url);
        this.load.image('binJaune', binImg.Jaune.url);
        this.load.image('binVert', binImg.Vert.url);
        this.load.image('binBleue', binImg.Bleue.url);
        this.load.image('binViolet', binImg.Violet.url);
        this.load.image('binNoir', binImg.Noir.url);
        this.load.image('binOrange', binImg.Orange.url);
        this.load.image('binRouge', binImg.Rouge.url);
        this.load.image('falseBin', '../../assets/poubelles/falseBin.png')

        //garbage pile textures
        this.load.image('garbagePile', '../../assets/garbagePile.png');
        this.load.image('garbagePileGlow', '../../assets/garbagePile-glow.png');
     
        //Loading other player spritesheet
        this.load.spritesheet('otherPlayer', playerImg, {
            frameWidth: PLAYER_SPRITE_WIDTH,
            frameHeight: PLAYER_SPRITE_HEIGHT
        });

        //Loading dino spritesheet
        this.load.spritesheet('playerWhite', '../../assets/player_sprite/blanc.png', {
            frameWidth: 24,
            frameHeight: 24
        });

        this.load.image('mapP', mapProps);


    }

    create() {

        //Audio
        trashAudio = new Audio('../audio/trash-audio.mp3');
        binAudio = new Audio('../audio/bin-audio.mp3');
        trashAudio.volume = .4;
        binAudio.volume = .3;

        //Map tiles display
        const mapT = this.add.image(0, 0, 'mapT');
        mapT.displayHeight = MAP_HEIGHT * MAP_ZOOM;
        mapT.displayWidth = MAP_WIDTH * MAP_ZOOM;
        mapT.setDepth(1);


        //DECHETS
        garbagePile = this.add
            .image(-70, 0, 'garbagePile')
            .setScale(0.6)
            .setDepth(2)
        garbagePile.in = false;





        //JOUEURS
        let newContainer = (name, position,imposteur) => {
            let container = this.add.container(position.x, position.y);

            let textPlayer = this.add.text(0, -45, name)
            textPlayer.x = textPlayer.width / -2
            textPlayer.name = 'text';
            if(imposteur){
                textPlayer.setColor("#CB4335")
            }
            container.add(textPlayer);

            let spritePlayer = this.add.sprite(0, 0, 'playerWhite')
            spritePlayer.name = 'sprite';
            spritePlayer.displayHeight = PLAYER_HEIGHT;
            spritePlayer.displayWidth = PLAYER_WIDTH;
            spritePlayer.play('iddle',true)

            container.add(spritePlayer);
            container.setDepth(2);

            return container;
        }

        let newPlayer = (id, username, color, imposteur, position) => {
            let newPlayer = new Player(id, newContainer(username, position, imposteur), username, color, imposteur);
            newPlayer.walkSound.loop = true;
            newPlayer.walkSound.volume = .5
            return newPlayer;
        }

        //Récuperation des infos de la session
        socket.emit('getRoomInfo');
        socket.on('roomInfo', (data) => {
            roomInfos = data;
            clientId = data.me;
            console.log(roomInfos);

            socket.emit('getGameInfos', roomInfos.id);

            spawnPositions = generateSpawnPositions(roomInfos.playerList.length)
            let i = 0;
            for (const aPlayer of data.playerList) {

                if (aPlayer.id != clientId) {
                    otherPlayer.push(newPlayer(aPlayer.id, aPlayer.username, 'yellow', false, spawnPositions[i]));
                }
                else {
                    player = newPlayer(aPlayer.id, aPlayer.username, 'blue', aPlayer.isImposteur, spawnPositions[i]);
                    player.container.getByName('sprite').play('iddle')
                    socket.emit('joinGame', roomInfos.id, clientId, aPlayer.username);
                }
                i++;
            }

            socket.on('giveGameInfos', (data) => {
                gameInfos = data;
                console.log(data)
                if (clientId == roomInfos.owner.id && !gameInfos) {
                    socket.emit('createGameInfos', roomInfos.id);
                    console.log('je demande a creer les poubelles');

                    socket.emit('generate-bins-query')
                }
            });

            socket.emit('getPoubelles', roomInfos.id);
        });

        this.input.on(Phaser.Input.Events.POINTER_DOWN, function (pointer) {
            console.log("x: ", Math.ceil(player.container.x), " y: ", Math.ceil(player.container.y))
        });


        //Map tiles display
        const mapP = this.add.image(0, 0, 'mapP');
        mapP.displayHeight = MAP_HEIGHT * MAP_ZOOM;
        mapP.displayWidth = MAP_WIDTH * MAP_ZOOM;
        mapP.setDepth(10);

        //Player Animation
        this.anims.create({
            key: 'iddle',
            frames: this.anims.generateFrameNumbers('playerWhite',{start:0,end:3}),
            frameRate: 5,
            reapeat: -1
        });
        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNumbers('playerWhite',{start:4,end:10}),
            frameRate: 15,
            reapeat: -1
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

        /*this.minimap = this.cameras.add(5, 5, MAP_WIDTH / 5, MAP_HEIGHT / 5)
        this.minimap.setZoom(0.08)
        this.minimap.setBackgroundColor(0x002244);
        this.minimap.setName('mini');*/



        //POUBELLE
        socket.on('generate-bins', (bins) => {
            if (!allBins[0]) {
                for (const bin in binImg) {
                    let color = bins[bin].color;
                    let tmpBin = this.add.image(bins[color].x, bins[color].y, 'falseBin')
                    if (bins[color].flip) tmpBin.flipX = true;
                    tmpBin.unknow = bins[color].unknow;
                    tmpBin.in = false;
                    tmpBin.color = color;
                    allBins.push(tmpBin)
                }
                for (const bin of allBins) {
                    bin.displayHeight = 200 * POUBELLE_ZOOM;
                    bin.displayWidth = 125 * POUBELLE_ZOOM;
                    bin.pixelArt = true;
                    bin.setDepth(30)
                }
            }else{
                for (const bin of allBins) {
                    //console.log("je load les poubelles en gros")
                    if (bins[bin.color].unknow == false) {
                        bin.setTexture('bin' + bin.color);
                    }
                }
            }
        });

        socket.on('regenerate-bins', (bins)=>{
            for(const bin of allBins){
                bin.x = bins[bin.color].x;
                bin.y = bins[bin.color].y;
                bin.setTexture('falseBin');
                bin.flipX = bins[bin.color].flip;
                
            }
            
            

        })

        //this.enable([garbagePile,player], Phaser.Physics.ARCADE);

    }

    update() {
        if (roomInfos && gameInfos != undefined) {

            //Camera always centered on player
            //this.minimap.startFollow(player.container, true, 0.5, 0.5)
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
            moveAnimate(keys, player.container.getByName('sprite'), player);
            //Animate other player
            otherPlayer.forEach(p => {
                distance = getDistance(p.container.x, p.container.y, player.container.x, player.container.y)
                p.walkSound.volume = getVolume(distance)
                if (p.moving && !p.container.getByName('sprite').anims.isPlaying) {
                    p.container.getByName('sprite').play('running');
                    if (p.walkSound.paused) startWalkSound(p.walkSound);
                }
                else if (!p.moving && p.container.getByName('sprite').anims.isPlaying) {
                    p.container.getByName('sprite').stop('running');
                    p.container.getByName('sprite').stop('iddle');
                    p.container.getByName('sprite').setFrame(4)
                    stopWalkSound(p.walkSound);
                }
            });

            //trigger poubelle 

            for (const bin of allBins) {
                if (getDistance(player.container.x, player.container.y, bin.x, bin.y) < 50) {
                    if (!bin.in) {
                        if (bin.unknow == true) {
                            bin.setTexture('bin' + bin.color);
                            socket.emit('setPoubelleUnknowAttribute', bin.color, false);
                            console.log('oui');
                        }
                        //bin.setTexture('garbagePileGlow')
                        bin.in = true;
                        console.log('in');
                    }
                } else {
                    if (bin.in) {
                        //bin.setTexture('garbagePile');
                        bin.in = false;
                        console.log('out');
                    }
                }
                
                //Déposer déchet dans poubelle
                if (keys.includes('KeyE') /*&& !player.imposteur*/) {
                    if (bin.in && player.dechet) {
                        this.events.emit('throwTrash',player.dechet.trashColor==bin.color)
                        dechet.recycleDechet(player, bin);
                        binAudio.play();
                    }
                }

                //Melanger les poubelles POUR IMPOSTEUR
                if (keys.includes('KeyP') && player.imposteur) {
                    imposteur.changebin();
                }
            }


            ///trigger garbage pile
            if (getDistance(player.container.x, player.container.y, garbagePile.x, garbagePile.y) < 160) {
                if (!garbagePile.in) {
                    garbagePile.setTexture('garbagePileGlow')
                    garbagePile.in = true;
                    console.log('in');
                }
            } else {
                if (garbagePile.in) {
                    garbagePile.setTexture('garbagePile');
                    garbagePile.in = false;
                    console.log('out');
                }
            }
            //Récuperer déchet dans tas 
            if (keys.includes('KeyE')/*&& !player.imposteur*/) {
                if (garbagePile.in && !player.dechet) {
                    dechet.getDechet(player);
                    this.events.emit('showTrash', player.dechet)
                    trashAudio.play();
                }
            }
        }

        //this.physics.arcade.collide(garbagePile, player, collisionHandler, null, this);
    }

    /*render(){
        this.debug.body(garbagePile);
        this.debug.body(player);
    }*/
}


class MyHUD extends Phaser.Scene {

    constructor() {
        super({ key: 'HUDScene', active: true });
        this.timer = undefined;
        this.gameDuration = 20;
    }
    preload() {
        this.load.image('trash', '../../assets/garbage.png');

        dechets.forEach(d => {
            this.load.image(d.name, d.url);
        });
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        
        // --------------------- PROGRESS BAR ---------------------

        progressBar = this.add.graphics();
        progressBox = this.add.graphics();

        
        progressBox.fillStyle(0x000000,1)
        progressBox.fillRoundedRect(window.innerWidth - 720,window.innerHeight - 120,700,50,27);
        progressBox.setDepth(10);


        // ---------------------- TIMER ---------------------
        timerLabel = this.add.text(window.innerWidth-310, window.innerHeight - 130, "Timer", { fontSize: 50 })
            .setDepth(10)
            .setOrigin(1, 1)
        this.timer = new CountdownController(this, this.gameDuration, timerLabel,progressBar);
        this.timer.start();

        //AJOUT DECHET EN MAIN
        let backgroundTrash = this.add.circle(30+(window.innerHeight/10), window.innerHeight-30-(window.innerHeight/10), window.innerHeight / 10, 0xdbdbdb)
            .setAlpha(0.3) 
            .setOrigin(0.5)

        let trashDisplay = this.add.image(30+(window.innerHeight/10), window.innerHeight-30-(window.innerHeight/10), 'trash')
            .setVisible(false)
            .setOrigin(0.5)

        let trashText = this.add.text(20 + window.innerHeight / 10, window.innerHeight - 5, 'Ramassez un déchet')
            .setOrigin(.5, 1)
            .setFontSize(17)


        //----------EVENTS----------
        let myGame = this.scene.get('GameScene')

        //MONTRER LE DECHET EN MAIN
        myGame.events.on('showTrash', (d) => {
            //afficher l'image du dechet
            trashDisplay.setTexture(d.name)
            let proportions = trashDisplay.width/trashDisplay.height
            if (trashDisplay.height > trashDisplay.width){
                trashDisplay.displayHeight = window.innerHeight / 8
                trashDisplay.displayWidth = trashDisplay.displayHeight*proportions
            }
            else{
                trashDisplay.displayWidth = window.innerHeight / 8
                trashDisplay.displayHeight = trashDisplay.displayWidth/proportions
            }
            trashDisplay.setVisible(true)

            //afficher son nom
            trashText.setText(d.name)
            trashText.setVisible(true)
        })
        //CLE DECHET VIENS D'ETRE JETé
        myGame.events.on('throwTrash', (result) => {
            trashDisplay.setVisible(false)
            trashText.setText(result ? "Bravo!":"Mauvaise poubelle!")
            .setColor(result ? "#00ff00" : "#ff0000")
            setTimeout(()=>{
                trashText.setColor("#ffffff")
                trashText.setText("Ramassez un déchet")
            },5000)
        })
        //window resize
        window.addEventListener('resize', () => {
            backgroundTrash.x = 30+(window.innerHeight/10)
            backgroundTrash.y = window.innerHeight-30-(window.innerHeight/10)

            trashDisplay.x = 30+(window.innerHeight/10) 
            trashDisplay.y = window.innerHeight-30-(window.innerHeight/10)
            let proportions = trashDisplay.width/trashDisplay.height
            if (trashDisplay.height > trashDisplay.width){
                trashDisplay.displayHeight = window.innerHeight / 8
                trashDisplay.displayWidth = trashDisplay.displayHeight*proportions
            }
            else{
                trashDisplay.displayWidth = window.innerHeight / 8
                trashDisplay.displayHeight = trashDisplay.displayWidth/proportions
            }

            trashText.x = 20 + window.innerHeight / 10
            trashText.y = window.innerHeight - 10

            // timerLabel.x = window.innerWidth - 20
            // timerLabel.y = window.innerHeight - 20

            // progressBox.x = window.innerWidth - 20;
            // progressBox.y = window.innerHeight - 20;
            // progressBar.x = window.innerWidth - 20;
            // progressBar.y = window.innerHeight - 20;
        })
    }
    update() {
        //this.timer.isFinish()
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: '100%',
    height: '100%',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics:{
        default: 'arcade'
    },
    scene: [MyGame, MyHUD]
};


const game = new Phaser.Game(config);