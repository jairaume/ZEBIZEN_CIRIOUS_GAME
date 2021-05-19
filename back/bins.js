const POUBELLE_POS = [
    {x: 0, y:0},
]
const POUBELLE_POS_V2 =[
    {'id':0,'x': 975, 'y': -1721},
    {'id':1,'x': -3436, 'y': 1144},
    {'id':2,'x': 650, 'y': 2625},
    {'id':3,'x': 3355, 'y': -2360},
    {'id':4,'x':2630, 'y': -1400},
    {'id':5,'x': -156, 'y': -2460},
    {'id':6,'x': -2786, 'y': -2124},
    {'id':7,'x': -2612, 'y': -685},
    {'id':8,'x': -2863, 'y': -113},
    {'id':9,'x': -2567, 'y': 1277},
    {'id':10,'x': -1030, 'y': 1670},
    {'id':11,'x': -2439, 'y': 2317}
]
class functionBins{
    constructor(){
        this.list = [];
    }
    entierAleatoire(min, max){
     return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    isIn(nb, tab){
        for(let i=0; i< tab.length; i++){
            if(nb === tab[i]){
                return true
            }
        }
        return false;
    }
    coordWithId(id){
        let coord = [];
        coord.push({'x':POUBELLE_POS_V2[id]['x'], 'y':POUBELLE_POS_V2[id]['y']})
        return coord
    }
    aleatoirePosBins(list){
        let nb = this.entierAleatoire(0,11);
        if(this.isIn(nb,list) === true){
            while(this.isIn(nb,list) === true){
                nb = this.entierAleatoire(0,11);
            }
        }
        list.push(nb);
        let coord = this.coordWithId(nb);
        return coord;
    }
    
    generateBins(){
        let coord =[];
        for(let i =0; i<9; i++){
            coord[i] = this.aleatoirePosBins(this.list);
        }
        const bin = {
            "Bleue" : {color:'Bleue',x: coord[0][0]['x'], y: coord[0][0]['y'], url: '../../assets/poubelle-bleue.png'},
            "Violet" : {color: 'Violet',x: coord[1][0]['x'], y: coord[1][0]['y'], url: '../../assets/poubelle-violet.png'},
            "Marron" :{color: 'Marron',x: coord[2][0]['x'], y: coord[2][0]['y'], url: '../../assets/poubelle-marron.png'},
            "Jaune" : {color: 'Jaune',x: coord[3][0]['x'], y: coord[3][0]['y'], url: '../../assets/poubelle-jaune.png'},
            "Noir": {color: 'Noir',x: coord[4][0]['x'], y: coord[4][0]['y'], url: '../../assets/poubelle-noir.png'},
            "Rouge" : {color: 'Rouge',x: coord[5][0]['x'], y: coord[5][0]['y'], url: '../../assets/poubelle-rouge.png'},
            "Orange" : {color: 'Orange',x: coord[6][0]['x'], y: coord[6][0]['y'], url: '../../assets/poubelle-orange.png'},
            "Blanc": {color: 'Blanc',x: coord[7][0]['x'], y: coord[7][0]['y'], url: '../../assets/poubelle-blanc.png'},
            "Vert": {color: 'Vert',x: coord[8][0]['x'], y: coord[8][0]['y'], url: '../../assets/poubelle-vert.png'}
        };
        return bin;
    }
    
    
}

module.exports =  functionBins;

