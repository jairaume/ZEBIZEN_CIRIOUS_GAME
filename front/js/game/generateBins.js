const POUBELLE_POS = [
    {x: 0, y:0},
]
const POUBELLE_POS_V2 =[
    {x: -3436, y: 1144},
    {x: 650, y: 2625},
    {x: 3355, y: -2360},
    {x:2630, y: -1400},
    {x: -156, y: -2460},
    {x: -2786, y: -2124},
    {x: -2612, y: -685},
    {x: -2863, y: -113},
    {x: -2567, y: 1277},
    {x: -1030, y: 1670},
    {x: -2439, y: 2317},
    {x: 975, y: -1721},
]

function generateBins(){
    const bin = {
        "Bleue" : {color:'Bleue',x: 0, y: 0, url: '../../assets/poubelle-bleue.png'},
        "Violet" : {color: 'Violet',x: 60, y: 0, url: '../../assets/poubelle-violet.png'},
        "Marron" :{color: 'Marron',x: 120, y: 0, url: '../../assets/poubelle-marron.png'},
        "Jaune" : {color: 'Jaune',x: 180, y: 0, url: '../../assets/poubelle-jaune.png'},
        "Noir": {color: 'Noir',x: 240, y: 0, url: '../../assets/poubelle-noir.png'},
        "Rouge" : {color: 'Rouge',x: 300, y: 0, url: '../../assets/poubelle-rouge.png'},
        "Orange" : {color: 'Orange',x: 360, y: 0, url: '../../assets/poubelle-orange.png'},
        "Blanc": {color: 'Blanc',x: 420, y: 0, url: '../../assets/poubelle-blanc.png'},
        "Vert": {color: 'Vert',x: 480, y: 0, url: '../../assets/poubelle-vert.png'}
    };
    return bin;
}

export {generateBins};