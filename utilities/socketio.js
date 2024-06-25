
exports.socketio = (io)=>{
    io.on('connection',(socket)=>{
        console.log('new client connected');
    
        socket.on('sendMessage',(data)=>{
            io.emit('recivedMessage',data);
        })
    
        socket.on('disconnect',()=>{
            console.log('client disconnected');
        });
    });
}