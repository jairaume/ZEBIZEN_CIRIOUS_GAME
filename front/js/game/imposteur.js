let imposteur = {
    changeBin(){
        socket.emit('regenerate-bins-query','');
    },
    reverseBin(colorBin, angle){
        socket.emit('reverse-bin',colorBin,angle);
    }
}

export{imposteur};