import { Player } from './class_PLAYER.js'
import { generateSpawnPositions } from './generateSpawnPositions.js'
import { generateBins } from './generateBins.js'
import { getDistance } from './getDistance.js'
import { dechet } from './dechets.js'
import { dechets } from './dechets.js'
import CountdownController from './countdownTimer.js'
import GarbageCountroller from './garbageCountroller.js'
import { imposteur } from './imposteur.js'



const playerImg = {
    'black': { url: '../../assets/player_sprite/black.png', color: 'black', id: 0 },
    'blue': { url: '../../assets/player_sprite/blue.png', color: 'blue', id: 1 },
    'cyan': { url: '../../assets/player_sprite/cyan.png', color: 'cyan', id: 2 },
    'dGreen': { url: '../../assets/player_sprite/dGreen.png', color: 'dGreen', id: 3 },
    'green': { url: '../../assets/player_sprite/green.png', color: 'green', id: 4 },
    'yellow': { url: '../../assets/player_sprite/yellow.png', color: 'yellow', id: 5 },
    'brown': { url: '../../assets/player_sprite/brown.png', color: 'brown', id: 6 },
    'red': { url: '../../assets/player_sprite/red.png', color: 'red', id: 7 },
    'rose': { url: '../../assets/player_sprite/rose.png', color: 'rose', id: 8 },
    'white': { url: '../../assets/player_sprite/white.png', color: 'white', id: 9 },
};


//V2
const Map_layer_0 = '../../assets/map/map_layer_0.png';
const Map_layer_1 = '../../assets/map/map_layer_1.png';
const Map_layer_2 = '../../assets/map/map_layer_2.png';


const PLAYER_HEIGHT = 80
const PLAYER_WIDTH = 80
const MAP_WIDTH = 1392
const MAP_HEIGHT = 1120
const MAP_ZOOM = 5
const POUBELLE_ZOOM = 0.4

let clientId;
let myIndex;
let loadingText;
let infoAffiche = false;


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
let carte;
let megaphone;

// Timer
let timerCountroller;
let timerLabel;
let gameDuration = 150; // seconds

// Déchets 
let garbageCountroller = new GarbageCountroller();
let garbageLabel;
let garbageObjectif = 50;

let screenCenterX;
let screenCenterY;

//creating gamemode
const currentGame = new GameMode(8);


class MyGame extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;

        //Loading map layer

        this.load.image('map_layer_0', Map_layer_0);
        this.load.image('map_layer_1', Map_layer_1);
        this.load.image('map_layer_2', Map_layer_2);

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

        //Info Recyclage + Megaphone
        this.load.image('infoRecycle', '../../assets/Affiche_tri_selectif.png');
        this.load.image('megaphone', '../../assets/megaphone.png');

        //Loading dino spritesheet
        for (const img in playerImg) {
            this.load.spritesheet(playerImg[img].color + 'Player', playerImg[img].url, {
                frameWidth: 24,
                frameHeight: 24
            });
        };

        //Sac poubelle
        this.load.image('trashBag', '../../assets/dechets/sac.png')

    }

    create() {

        loadingText = this.add.text(screenCenterX, screenCenterY, 'CHARGEMENT DU JEU...').setOrigin(0.5).setDepth(101);

        //Audio
        trashAudio = new Audio('../audio/trash-audio.mp3');
        binAudio = new Audio('../audio/bin-audio.mp3');
        trashAudio.volume = .4;
        binAudio.volume = .3;

        //Map tiles display
        /*
        const mapT = this.add.image(0, 0, 'mapT');
        mapT.displayHeight = MAP_HEIGHT * MAP_ZOOM;
        mapT.displayWidth = MAP_WIDTH * MAP_ZOOM;
        mapT.setDepth(1);

        //Map tiles display
        const mapP = this.add.image(0, 0, 'mapP');
        mapP.displayHeight = MAP_HEIGHT * MAP_ZOOM;
        mapP.displayWidth = MAP_WIDTH * MAP_ZOOM;
        mapP.setDepth(10);*/

        //map layers display

        const map_layer_0 = this.add.image(0, 0, 'map_layer_0')
        map_layer_0.displayHeight = MAP_HEIGHT * MAP_ZOOM;
        map_layer_0.displayWidth = MAP_WIDTH * MAP_ZOOM;
        map_layer_0.setDepth(1);

        const map_layer_1 = this.add.image(0, 0, 'map_layer_1')
        map_layer_1.displayHeight = MAP_HEIGHT * MAP_ZOOM;
        map_layer_1.displayWidth = MAP_WIDTH * MAP_ZOOM;
        map_layer_1.setDepth(200);

        const map_layer_2 = this.add.image(0, 0, 'map_layer_2')
        map_layer_2.displayHeight = MAP_HEIGHT * MAP_ZOOM;
        map_layer_2.displayWidth = MAP_WIDTH * MAP_ZOOM;
        map_layer_2.setDepth(100);


        //DECHETS
        garbagePile = this.add
            .image(-70, 0, 'garbagePile')
            .setScale(0.6)
            .setDepth(99)
        garbagePile.in = false;

        //JOUEURS
        let newContainer = (name, position, imposteur, color) => {
            let container = this.add.container(position.x, position.y);

            let textPlayer = this.add.text(0, -45, name)
            textPlayer.x = textPlayer.width / -2
            textPlayer.name = 'text';
            if (imposteur) {
                textPlayer.setColor("#ff1010")
            }
            container.add(textPlayer);

            let spritePlayer = this.add.sprite(0, 0, color + 'Player')
            spritePlayer.name = 'sprite';
            spritePlayer.displayHeight = PLAYER_HEIGHT;
            spritePlayer.displayWidth = PLAYER_WIDTH;

            container.add(spritePlayer);
            container.setDepth(250);

            return container;
        }

        let newPlayer = (id, username, color, imposteur, position) => {
            let newPlayer = new Player(id, newContainer(username, position, imposteur, color), username, color, imposteur);
            newPlayer.walkSound.loop = true;
            newPlayer.walkSound.volume = .5;
            return newPlayer;
        }

        //Récuperation des infos de la session
        socket.emit('getRoomInfo');
        socket.on('roomInfo', (data) => {
            roomInfos = data;
            clientId = data.me;
            myIndex = roomInfos.playerList.findIndex(playerr => playerr.id == clientId)
            let me = roomInfos.playerList[myIndex];
            let impo = '';
            socket.emit('getGameInfos', roomInfos.id);

            spawnPositions = generateSpawnPositions(roomInfos.playerList.length)
            currentGame.setSpeed(Math.ceil(currentGame.getSpeed() * roomInfos.speed))
            let i = 0;
            for (const aPlayer of data.playerList) {
                if (aPlayer.id != clientId) {
                    otherPlayer.push(newPlayer(aPlayer.id, aPlayer.username, aPlayer.color, (me.isImposteur && !roomInfos.modeIncognito) ? aPlayer.isImposteur : false, spawnPositions[i]));
                }
                else {
                    player = newPlayer(aPlayer.id, aPlayer.username, aPlayer.color, aPlayer.isImposteur, spawnPositions[i]);
                    socket.emit('joinGame', roomInfos.id, clientId, aPlayer.username);
                }
                i++;
            }
            if (me.isImposteur) this.events.emit('impo')

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
            if(player.container){
                console.log("x: ", Math.ceil(player.container.x), " y: ", Math.ceil(player.container.y))

            }
        });

        for (const img in playerImg) {
            //Player Animation iddle
            this.anims.create({
                key: playerImg[img].color + 'Iddle',
                frames: this.anims.generateFrameNumbers(playerImg[img].color + 'Player', { start: 0, end: 3 }),
                frameRate: 5,
                reapeat: -1
            });
            //Player Animation running
            this.anims.create({
                key: playerImg[img].color + 'Running',
                frames: this.anims.generateFrameNumbers(playerImg[img].color + 'Player', { start: 4, end: 10 }),
                frameRate: 15,
                reapeat: -1
            });
            //Player Animation kick
            this.anims.create({
                key: playerImg[img].color + 'Kick',
                frames: this.anims.generateFrameNumbers(playerImg[img].color + 'Player', { start: 10, end: 13 }),
                frameRate: 15,
                reapeat: -1
            });
        }


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
            let index = otherPlayer.findIndex(player => player.id == id);
            if (data.x < otherPlayer[index].container.x) {
                otherPlayer[index].container.getByName('sprite').flipX = true;
            }
            else if (data.x > otherPlayer[index].container.x) {
                otherPlayer[index].container.getByName('sprite').flipX = false;
            }
            otherPlayer[index].container.x = data.x;
            otherPlayer[index].container.y = data.y;
            //console.log(data.layer);
            switch (data.layer) {
                case 0:
                    otherPlayer[index].container.setDepth(250);

                    break;
                case 1:
                    otherPlayer[index].container.setDepth(150);

                    break;
                case 2:
                    otherPlayer[index].container.setDepth(50);

                    break;
                default:
                    otherPlayer[index].container.setDepth(250);

            }

            otherPlayer[index].moving = true;
        });
        socket.on('end-move', (id) => {
            let index1 = otherPlayer.findIndex((player) => player.id == id);
            otherPlayer[index1].moving = false;
            otherPlayer[index1].container.getByName('sprite').setFrame(11);
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
            } else {
                for (const bin of allBins) {
                    //console.log("je load les poubelles en gros")
                    if (bins[bin.color].unknow == false) {
                        bin.setTexture('bin' + bin.color);
                    }
                }
            }
        });

        socket.on('regenerate-bins', (bins) => {
            for (const bin of allBins) {
                bin.x = bins[bin.color].x;
                bin.y = bins[bin.color].y;
                bin.angle = bins[bin.color].angle;

                if (bins[bin.color].unknow) bin.setTexture('falseBin');

                bin.flipX = bins[bin.color].flip;

            }
        })

        socket.on('go-reunion', () => {
            player.container.x = spawnPositions[myIndex].x;
            player.container.y = spawnPositions[myIndex].y;
            player.inReunion = true;
            socket.emit('move', { x: player.container.x, y: player.container.y, layer: player.layer, id: player.id })
            socket.emit('end-move', player.id)
        })

        socket.on('setPoubelleHead', (id) => {
            let sac = this.add.image(0, -30, 'trashBag').setFlipY(true).setOrigin(.5, 0)
            sac.displayWidth = PLAYER_WIDTH - 20
            sac.displayHeight = (sac.width / sac.height) * sac.displayWidth
            sac.name = 'trashBag'
            if (id == clientId) {
                player.container.add(sac)
            }
            else {
                let index3 = otherPlayer.findIndex(p => p.id == id)
                otherPlayer[index3].container.add(sac)
            }
        });

        loadingText.setVisible(false)

        carte = this.add.image(562, -510, 'infoRecycle')
            .setDepth(201)
            .setDisplaySize(110, 50);

        megaphone = this.add.image(390, -25, 'megaphone')
            .setDepth(10)
            .setFlipX(true)
            .setDisplaySize(40, 40);
        megaphone.angle = 30;
    }


    update() {
        if (roomInfos && gameInfos != undefined) {

            //Camera always centered on player
            //this.minimap.startFollow(player.container, true, 0.5, 0.5)
            this.scene.scene.cameras.main.startFollow(player.container);
            //Move player when appropriate keys are pressed
            let playerMoved = player.move(keys, currentGame);
            if (playerMoved) {
                socket.emit('move', { x: player.container.x, y: player.container.y, layer: player.layer, id: player.id })
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
                if (p.moving) {
                    p.container.getByName('sprite').play(p.color + 'Running', true);
                    if (p.walkSound.paused) startWalkSound(p.walkSound);
                }
                else if (!p.moving) {
                    p.container.getByName('sprite').play(p.color + 'Iddle', true);
                    stopWalkSound(p.walkSound);
                }
            });

            //mettre une poubelle sur la tete POUR IMPOSTEUR
            for (const oPlayer of otherPlayer) {
                if (getDistance(player.container.x, player.container.y, oPlayer.container.x, oPlayer.container.y) < 100) {
                    if (player.imposteur && !player.cooldown) {
                        if (keys.includes('KeyF') && !oPlayer.poubelle) {
                            if (roomInfos.modeIncognito) {
                                oPlayer.poubelle = true;
                                oPlayer.recycle = false;
                                socket.emit('setPoubelleHead', oPlayer.id);
                                player.cooldown = true;
                                setTimeout(() => {
                                    player.cooldown = false;
                                }, 20000);
                            }
                            if (!roomInfos.modeIncognito && !oPlayer.imposteur) {
                                oPlayer.poubelle = true;
                                oPlayer.recycle = false;
                                socket.emit('setPoubelleHead', oPlayer.id);
                                player.cooldown = true;
                                setTimeout(() => {
                                    player.cooldown = false;
                                }, 20000);
                            }
                        }
                    }
                }
            }

            ///trigger garbage pile
            if (getDistance(player.container.x, player.container.y, garbagePile.x, garbagePile.y) < 160) {
                if (!garbagePile.in) {
                    garbagePile.setTexture('garbagePileGlow')
                    garbagePile.in = true;
                    console.log('in');
                }
            } 
            else {
                if (garbagePile.in) {
                    garbagePile.setTexture('garbagePile');
                    garbagePile.in = false;
                    console.log('out');
                }
            }


            //trigger poubelle 
            for (const bin of allBins) {
                if (getDistance(player.container.x, player.container.y, bin.x, bin.y) < 50) {
                    if (!bin.in) {
                        if (bin.unknow == true) {
                            bin.setTexture('bin' + bin.color);
                            socket.emit('setPoubelleUnknowAttribute', bin.color, false);
                        }
                        bin.in = true;
                        console.log('in');
                    }
                }
                else {
                    if (bin.in) {
                        //bin.setTexture('garbagePile');
                        bin.in = false;
                        console.log('out');
                    }
                }
            }

            //Melanger les poubelles POUR IMPOSTEUR
            if (keys.includes('KeyP') && player.imposteur && !player.cooldown) {
                imposteur.changeBin();
                player.cooldown = true;
                setTimeout(() => {
                    player.cooldown = false;
                }, 20000);
            }

            if (keys.includes('KeyE')) {
                //Récuperer déchet dans tas 
                if (garbagePile.in && !player.dechet && !player.imposteur && player.recycle) {
                    dechet.getDechet(player);
                    this.events.emit('showTrash', player.dechet)
                    garbageCountroller.autorizationOnTrue();
                    trashAudio.play();
                }

                //Lancer une reunion
                if (getDistance(player.container.x, player.container.y, megaphone.x, megaphone.y) < 50) {
                    socket.emit('reunion')
                }

                //trigger poubelle 
                for (const bin of allBins) {
                    if (bin.in) {
                        if (!player.imposteur) {
                            //Déposer déchet dans poubelle POUR GENTIL
                            if (player.dechet && bin.angle == 0 && garbageCountroller.getAutorization() && player.recycle) {
                                this.events.emit('throwTrash', player.dechet.trashColor == bin.color);
                                let goodChoice = dechet.recycleDechet(player, bin) == 1 ? true : false;
                                socket.emit("modifyGarbageServer", goodChoice);
                                binAudio.play();
                                return 1;
                            }

                            //Remettre les poubelles POUR GENTIL
                            if (bin.angle == 90) {
                                imposteur.reverseBin(bin.color, 0);
                                player.stop = true;
                                player.cantReclyque = true;
                                setTimeout(() => {
                                    player.stop = false;
                                    player.cantReclyque = false;
                                }, 5000);
                                return 1;
                            }
                        }
                        if (player.imposteur == true && !player.cooldown) {

                            //Renverser les poubelles POUR IMPOSTEUR
                            if (bin.angle == 0) {
                                imposteur.reverseBin(bin.color, 90);
                                player.stop = true;
                                player.cooldown = true;
                                setTimeout(() => {
                                    player.stop = false;
                                }, 5000);
                                setTimeout(() => {
                                    player.cooldown = false;
                                }, 20000);
                                return 1;
                            }
                            if (bin.angle == 90 && !player.cooldown) {
                                imposteur.reverseBin(bin.color, 0);
                                player.stop = true;
                                player.cooldown = true;
                                setTimeout(() => {
                                    player.stop = false;
                                    player.cooldown = false;
                                }, 5000);
                                return 1;
                            }
                        }
                    }
                }
            }

            //Agrandir les infos de recyclage   
            if (getDistance(player.container.x, player.container.y, carte.x, carte.y) < 100 && !infoAffiche) {
                this.events.emit('showInfo')
                infoAffiche = true;
            }
            else if (getDistance(player.container.x, player.container.y, carte.x, carte.y) > 100 && infoAffiche) {
                this.events.emit('hideInfo')
                infoAffiche = false;
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
    }

    preload() {
        this.load.image('trash', '../../assets/garbage.png');
        this.load.image('mapIcon', '../../assets/mapIcon.png');
        this.load.image('mapImg', '../../assets/minimap.png');
        this.load.image('reportIcon', '../../assets/alarm.png');
        this.load.image('infoRecycleBig', '../../assets/Affiche_tri_selectif.png');

        dechets.forEach(d => {
            this.load.image(d.name, d.url);
        });
    }

    create() {
        screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        // ---------------------- TIMER COUNTROLLER---------------------

        timerCountroller = new CountdownController(this, timerLabel, gameDuration)
        timerCountroller.start()

        // ---------------------- GARBAGE COUNTROLLER ---------------------

        garbageCountroller.setAttribute(this, garbageLabel, garbageObjectif)
        garbageCountroller.start();

        socket.on("sendGarbageClient", (garbageNumber) => {
            garbageCountroller.setGarbageNumber(garbageNumber);
        })
        socket.on("autorizationFalse", () => {
            garbageCountroller.autorizationOnFalse();
        });

        //----------------------HUD----------------------------
        let backgroundTrash = this.add.circle(30 + (window.innerHeight / 10), window.innerHeight - 30 - (window.innerHeight / 10), window.innerHeight / 10, 0x383838)
            .setAlpha(0.4)
            .setOrigin(0.5)

        let trashDisplay = this.add.image(30 + (window.innerHeight / 10), window.innerHeight - 30 - (window.innerHeight / 10), 'trash')
            .setVisible(false)
            .setOrigin(0.5)
/*
        if(!player.imposteur){
            let trashText = this.add.text(30 + (window.innerHeight / 10), window.innerHeight - 5, 'Vous êtes gentil !')
            .setOrigin(.5, 1)
            .setFontSize(17)
            .setColor("#1E90FF")
        }
        
        if(player.imposteur){
            let trashText = this.add.text(30 + (window.innerHeight / 10), window.innerHeight - 5, "Vous êtes l'imposteur !")
            .setOrigin(.5, 1)
            .setFontSize(17)
            .setColor("#ff0000")
        }
        */
        
        

        console.log('player', player);
        //----------BOUTTON MAP----------
        let buttonMap = this.add.circle(40, 40, window.innerHeight / 25, 0x383838)
            .setAlpha(0.8)
            .setOrigin(0.5)
        let iconMap = this.add.image(40, 40, 'mapIcon')
            .setDisplaySize(window.innerHeight / 25, window.innerHeight / 25)
            .setOrigin(0.5)
        let imgMap = this.add.image(screenCenterX, screenCenterY, 'mapImg')
            .setOrigin(0.5)
            .setVisible(false)
            .setDepth(1000)
        imgMap.setDisplaySize(window.innerHeight - 10, (window.innerHeight - 10) / (imgMap.width / imgMap.height))
        let mapText = this.add.text(40, 42 + window.innerHeight / 25, '(TAB)')
            .setOrigin(0.5, 0)
        let showMap = () => {
            buttonMap.setFillStyle(0x000000)
                .setAlpha(1)
            imgMap.setVisible(true)
        }
        let hideMap = () => {
            buttonMap.setFillStyle(0x383838)
                .setAlpha(.8)
            imgMap.setVisible(false)
        }
        buttonMap.setInteractive({ cursor: 'pointer' })

        //----------BOUTTON REPORT----------
        let buttonReport = this.add.circle(window.innerWidth - 50, window.innerHeight - 50, window.innerHeight / 25, 0x383838)
            .setAlpha(0.8)
            .setOrigin(0.5)
        let iconReport = this.add.image(window.innerWidth - 50, window.innerHeight - 50, 'reportIcon')
            .setDisplaySize(window.innerHeight / 25, window.innerHeight / 25)
            .setOrigin(0.5)
        imgMap.setDisplaySize(window.innerHeight - 10, (window.innerHeight - 10) / (imgMap.width / imgMap.height))
        let reportText = this.add.text(window.innerWidth - 50, window.innerHeight - 5, '(R)')
            .setOrigin(0.5, 1)
        let report = () => {
            socket.emit('reunion');
        }
        buttonReport.setInteractive({ cursor: 'pointer' });


        /*-------INFO DECHETS------*/
        let imgInfo = this.add.image(screenCenterX, screenCenterY, 'infoRecycleBig')
            .setOrigin(0.5)
            .setVisible(false)
            .setDepth(1000)
        imgInfo.setDisplaySize(window.innerHeight - 10, (window.innerHeight - 10) / (imgInfo.width / imgInfo.height))




        //----------EVENTS----------
        let myGame = this.scene.get('GameScene')

        /*----------------BUTTONS----------------*/
        //MAP
        buttonMap.on('pointerover', function () {
            buttonMap.setFillStyle(0x2f89ff)
                .setAlpha(1)
        })
        buttonMap.on('pointerout', function () {
            buttonMap.setFillStyle(0x383838)
                .setAlpha(.8)
        })
        buttonMap.on('pointerdown', showMap)
        buttonMap.on('pointerup', hideMap)
        var keyObj = myGame.input.keyboard.addKey('TAB');
        keyObj.on('down', showMap);
        keyObj.on('up', hideMap);

        //REPORT
        buttonReport.on('pointerover', function () {
            buttonReport.setFillStyle(0x2f89ff)
                .setAlpha(1)
        })
        buttonReport.on('pointerout', function () {
            buttonReport.setFillStyle(0x383838)
                .setAlpha(.8)
        })
        buttonReport.on('pointerup', report)
        var keyObj = myGame.input.keyboard.addKey('R');
        keyObj.on('up', report);



        //INFO IMPOSTEUR
        myGame.events.on('impo', () => {
            trashText.setText('Vous êtes imposteur')
                .setColor('#ff0000')
        });

        //AFFICHER LES INFOS DES DECHETS
        myGame.events.on('showInfo', () => {
            imgInfo.setVisible(true)
        });
        myGame.events.on('hideInfo', () => {
            imgInfo.setVisible(false)
        });


        //MONTRER LE DECHET EN MAIN
        myGame.events.on('showTrash', (d) => {
            //afficher l'image du dechet
            trashDisplay.setTexture(d.name)
            let proportions = trashDisplay.width / trashDisplay.height
            if (trashDisplay.height > trashDisplay.width) {
                trashDisplay.displayHeight = window.innerHeight / 8
                trashDisplay.displayWidth = trashDisplay.displayHeight * proportions
            }
            else {
                trashDisplay.displayWidth = window.innerHeight / 8
                trashDisplay.displayHeight = trashDisplay.displayWidth / proportions
            }
            trashDisplay.setVisible(true)

            //afficher son nom
            trashText.setText(d.name)
            trashText.setVisible(true)
        })

        //CLE DECHET VIENS D'ETRE JETé
        myGame.events.on('throwTrash', (result) => {
            trashDisplay.setVisible(false)
            trashText.setText(result ? "Bravo!" : "Mauvaise poubelle!")
                .setColor(result ? "#00ff00" : "#ff0000")
            setTimeout(() => {
                trashText.setColor("#ffffff")
                trashText.setText("Ramassez un déchet")
            }, 5000)
        })

        //window resize
        window.addEventListener('resize', () => {
            backgroundTrash.x = 30 + (window.innerHeight / 10)
            backgroundTrash.y = window.innerHeight - 30 - (window.innerHeight / 10)

            screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
            screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

            trashDisplay.x = 30 + (window.innerHeight / 10)
            trashDisplay.y = window.innerHeight - 30 - (window.innerHeight / 10)
            let proportions = trashDisplay.width / trashDisplay.height
            if (trashDisplay.height > trashDisplay.width) {
                trashDisplay.displayHeight = window.innerHeight / 8
                trashDisplay.displayWidth = trashDisplay.displayHeight * proportions
            }
            else {
                trashDisplay.displayWidth = window.innerHeight / 8
                trashDisplay.displayHeight = trashDisplay.displayWidth / proportions
            }
            trashText.x = 20 + window.innerHeight / 10
            trashText.y = window.innerHeight - 10

            // timerLabel.x = window.innerWidth - 20
            // timerLabel.y = window.innerHeight - 20

            buttonReport.x = window.innerWidth - 50
            buttonReport.y = window.innerHeight - 50
            iconReport.x = buttonReport.x
            iconReport.y = buttonReport.y
            reportText.x = window.innerWidth - 50
            reportText.y = window.innerHeight - 5

            imgMap.setX(screenCenterX).setY(screenCenterY)

            timerCountroller.target.setX(screenCenterX).setY(20)
            garbageCountroller.garbageLabel.setX(window.innerWidth-50).setY(10);
            garbageCountroller.garbageLabel.wordWrap.width = window.innerWidth/4
        })


    }

    update() {

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
    physics: {
        default: 'arcade'
    },
    scene: [MyGame, MyHUD]
};

const game = new Phaser.Game(config);


