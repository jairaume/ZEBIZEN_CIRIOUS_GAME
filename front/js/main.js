let game = new Phaser.Game(640,360,Phaser.AUTO);

let GameState={
    preload: function(){

    },
    create: function(){

    },
    update : function(){

    }
};

game.state.add('GameState', GameState);
game.state.start('GameState');