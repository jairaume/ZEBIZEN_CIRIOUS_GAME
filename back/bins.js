const POUBELLE_POS = [
    {x: 0, y:0},
]
const POUBELLE_POS_V2 =[
    {'id':0,'x': 975, 'y': -1721, 'flip': false},
    {'id':1,'x': -3436, 'y': 1144, 'flip': true},
    {'id':2,'x': 650, 'y': 2625, 'flip': false},/////////
    {'id':3,'x': 3355, 'y': -2360, 'flip': false},
    {'id':4,'x':2630, 'y': -1400, 'flip': true},
    {'id':5,'x': -156, 'y': -2460, 'flip': true},
    {'id':6,'x': -2786, 'y': -2124, 'flip': false},
    {'id':7,'x': -2612, 'y': -685, 'flip': false},
    {'id':8,'x': -2863, 'y': -113, 'flip': true},
    {'id':9,'x': -2567, 'y': 1277, 'flip': true},
    {'id':10,'x': -1030, 'y': 1630, 'flip': false},
    {'id':11,'x': -2439, 'y': 2317, 'flip': false}

/*
    {'id':0,'x':-150,'y':100, 'flip': false},
    {'id':1,'x':-50,'y':100, 'flip': true},
    {'id':2,'x':-50,'y':200, 'flip': false},/////////
    {'id':3,'x':-50,'y':300, 'flip': false},
    {'id':4,'x':-50,'y':400, 'flip': true},
    {'id':5,'x':-50,'y':500, 'flip': true},
    {'id':6,'x':-50,'y':600, 'flip': false},
    {'id':7,'x':-50,'y':700, 'flip': false},
    {'id':8,'x':-50,'y':800, 'flip': true},
    {'id':9,'x':-50,'y':900, 'flip': true},
    {'id':10,'x': -50, 'y': 1000, 'flip': false},
    {'id':11,'x': -50, 'y': 1100, 'flip': false}*/
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
        coord.push({'x':POUBELLE_POS_V2[id]['x'], 'y':POUBELLE_POS_V2[id]['y'], 'flip':POUBELLE_POS_V2[id]['flip']})
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
            "Bleue" : {color:'Bleue',x: coord[0][0]['x'], y: coord[0][0]['y'], flip: coord[0][0]['flip'], unknow: true, angle : 0, url: '../../assets/poubelles/poubelle-bleue.png'},
            "Violet" : {color: 'Violet',x: coord[1][0]['x'], y: coord[1][0]['y'], flip: coord[1][0]['flip'], unknow: true,angle : 0, url: '../../assets/poubelles/poubelle-violet.png'},
            "Marron" :{color: 'Marron',x: coord[2][0]['x'], y: coord[2][0]['y'], flip: coord[2][0]['flip'], unknow: true,angle : 0, url: '../../assets/poubelles/poubelle-marron.png'},
            "Jaune" : {color: 'Jaune',x: coord[3][0]['x'], y: coord[3][0]['y'], flip: coord[3][0]['flip'], unknow: true,angle : 0, url: '../../assets/poubelles/poubelle-jaune.png'},
            "Noir": {color: 'Noir',x: coord[4][0]['x'], y: coord[4][0]['y'], flip: coord[4][0]['flip'], unknow:true, angle : 0,url: '../../assets/poubelles/poubelle-noir.png'},
            "Rouge" : {color: 'Rouge',x: coord[5][0]['x'], y: coord[5][0]['y'], flip: coord[5][0]['flip'], unknow: true,angle : 0, url: '../../assets/poubelles/poubelle-rouge.png'},
            "Orange" : {color: 'Orange',x: coord[6][0]['x'], y: coord[6][0]['y'], flip: coord[6][0]['flip'], unknow: true,angle : 0, url: '../../assets/poubelles/poubelle-orange.png'},
            "Blanc": {color: 'Blanc',x: coord[7][0]['x'], y: coord[7][0]['y'], flip: coord[7][0]['flip'], unknow: true,angle : 0, url: '../../assets/poubelles/poubelle-blanc.png'},
            "Vert": {color: 'Vert',x: coord[8][0]['x'], y: coord[8][0]['y'], flip: coord[8][0]['flip'], unknow: true,angle : 0, url: '../../assets/poubelles/poubelle-vert.png'}
        };

        this.list = [];

        return bin;
    }


    
    
}

module.exports =  functionBins;

