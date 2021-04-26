socket.emit('getRoomInfo');

socket.on('roomInfo',(data) => {
    console.log(data);
})