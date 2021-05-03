const POUBELLE_POS = [
    {x: 0, y:0},
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