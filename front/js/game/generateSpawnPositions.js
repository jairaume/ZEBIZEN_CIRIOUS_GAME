
const SPAWN_RADIUS = 200

function generateSpawnPositions(number){   
    let positions=new Array();
    let x,y;
    for (let i = 0; i<number ; i++){
        x=Math.floor(Math.cos(((Math.PI*2)/number)*i)*SPAWN_RADIUS)
        y=Math.floor(Math.sin(((Math.PI*2)/number)*i)*SPAWN_RADIUS)
        positions.push({
            x: x, 
            y: y
        });
        console.log(x+'  '+y)
        console.log(Math.floor(Math.cos(Math.PI)))
    }
    return positions;
}



export {generateSpawnPositions};