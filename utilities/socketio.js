const signUpModel = require('../models/signupModel')
const chatModel = require('../models/chatModel')

let users = {};

exports.socketio = (io)=>{
    io.on('connection',(socket)=>{

        socket.on('register', (clientId) => {
            users[clientId] = socket.id;
            socket.clientId = clientId;
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
    
        socket.on('signalingMessage', (message) => {
            const receiverSocketId = users[message.receiver];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('signalingMessage', {
                    ...message,
                    sender: socket.clientId
                });
            }
        });
        
        socket.on('disconnect',()=>{
            if (socket.clientId) {
                delete users[socket.clientId];
            }
        });
    });
}