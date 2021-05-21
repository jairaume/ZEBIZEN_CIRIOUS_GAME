let imposteur = {
    changebin(){
        socket.emit('regenerate-bins-query','');
    }
}

export{imposteur};