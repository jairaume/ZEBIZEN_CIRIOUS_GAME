let imposteur = {
    changebin(){
        socket.emit('regenerate-bins-query','');
    },
    reverseBin(colorBin){
        console.log('ici')
        socket.emit('reverse-bin',colorBin);
    }
}

export{imposteur};