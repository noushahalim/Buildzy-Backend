let users = {};

exports.socketio = (io)=>{
    io.on('connection',(socket)=>{
        console.log('new client connected : ' + socket.id);

        socket.on('register', (clientId) => {
            users[clientId] = socket.id;
            socket.clientId = clientId;
            console.log(`User registered: ${clientId} with socket ID: ${socket.id}`);
        });
    
        socket.on('sendMessage',(message)=>{
            const receiverSocketId = users[message.receiver];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receivedMessage', message);
            } else {
                socket.emit('user_not_found', message.receiver);
            }
        })
    
        socket.on('disconnect',()=>{
            console.log('client disconnected'  + socket.id);
            if (socket.clientId) {
                delete users[socket.clientId];
            }
        });
    });
}