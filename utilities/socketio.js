const signUpModel = require('../models/signupModel')
const chatModel = require('../models/chatModel')

let users = {};

exports.socketio = (io)=>{
    io.on('connection',(socket)=>{
        console.log('new client connected : ' + socket.id);

        socket.on('register', (clientId) => {
            users[clientId] = socket.id;
            socket.clientId = clientId;
            console.log(`User registered: ${clientId} with socket ID: ${socket.id}`);
        });
    
        socket.on('sendMessage', async (message)=>{
            const receiverSocketId = users[message.receiver];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receivedMessage', message);
            } else {
                const user = await signUpModel.findOne({_id:message.receiver})
                if(user.role==='client'){
                    await chatModel.findOneAndUpdate(
                        {engineerId:message.sender,clientId:message.receiver},
                        {$inc:{
                            clientUnread:1
                        }}
                    )
                }
                else if(user.role==='engineer'){
                    await chatModel.findOneAndUpdate(
                        {engineerId:message.receiver,clientId:message.sender},
                        {$inc:{
                            engineerUnread:1
                        }}
                    )
                }
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