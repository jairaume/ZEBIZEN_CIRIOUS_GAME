function getDechet(player){
    if(!player.dechet){
        
        player.dechet = {
            name: 'test',
            trashColor: 'Rouge'
        }

    }else{
        return 1;
    }
}

function recycleDechet(player,bin){

    if(player.dechet){
        console.log('poubelle: '+ bin.color + '  dechet couleur: ' + player.dechet.trashColor )
        if(player.dechet.trashColor == bin.color){
            player.dechet=null;
            console.log( 'bonne poubelle')
        }
        else {
            player.dechet=null;
            console.log( 'mauvaise poubelles')
        }
    }
    else{
        console.log( 'pas de dechet sur le player')
    }
}