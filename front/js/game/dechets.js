import {dechets} from './dechets_DATA.js'

let dechet = {

    getDechet(player){
        if(!player.dechet){
            let rand =Math.ceil(Math.random()*26)
            console.log(rand)
            let randDechet = dechets[rand]
            player.dechet = {
                name: randDechet.name,
                trashColor: randDechet.id_poubelle,
                url: randDechet.url
            }
    
        }else{
            return 1;
        }
    },
    
    recycleDechet(player,bin){
    
        if(player.dechet){
            console.log('poubelle: '+ bin.color + '  dechet couleur: ' + player.dechet.trashColor )
            if(player.dechet.trashColor == bin.color){
                player.dechet=null;
                console.log( 'bonne poubelle')
                return 1;
                // Incrémenter l'objectif de déchets
            }
            else {
                player.dechet=null;
                console.log( 'mauvaise poubelles')
                return -1;
                // Decrementer l'objectif de dechets
            }
        }
        else{
            return 0;
        }
    }
}

export {dechet};
export {dechets} from './dechets_DATA.js'
