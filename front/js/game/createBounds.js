const fs = require('fs');
const PNG = require('png-js');
const MAP_WIDTH = 1392
const MAP_HEIGHT = 1120

PNG.decode('./../../assets/map/map_intgrid.png',function(data){
    const result = {};
    for (let i = 0; i< data.length; i+=4){
        const row = Math.floor(i/4 /MAP_WIDTH);
        if (data[i] === 227 && data[i+1]== 30 && data[i+2] == 30){
            if (result[row]){
                result[row].push((i/4) % MAP_WIDTH);
            }
            else{
                result[row] = [(i/4) % MAP_WIDTH];
            }
        }
    }
    fs.writeFileSync(
        "./mapBounds.js",
        'export const mapBounds = '+ JSON.stringify(result)
    );
});