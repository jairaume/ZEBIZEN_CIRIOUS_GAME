const SPAWN_RADIUS = 200
const PLAYER_SPRITE_STARTX = -80
const PLAYER_SPRITE_STARTY = 0

function generateSpawnPositions(number){   
    let positions=new Array();
    let x,y;
    for (let i = 0; i<number ; i++){
        x=Math.floor(-65+Math.cos(((Math.PI*2)/number)*i)*SPAWN_RADIUS)
        y=Math.floor(Math.sin(((Math.PI*2)/number)*i)*SPAWN_RADIUS)
        positions.push({
            x: x, 
            y: y
        });
    }
    return positions;
}



export {generateSpawnPositions};