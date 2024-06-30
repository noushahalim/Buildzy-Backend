const chatModel = require('../models/chatModel')
const signupModel = require('../models/signupModel')

exports.chatSave = async(req,res)=>{
    try{
        const {sender,receiver,message} = req.body
        const id = req.user.id
        const client = await signupModel.findOne({_id:id})

        if(!client){
            return res.status(400).json('cannot access user details')
        }

        if(client.role==='client'){
            await chatModel.findOneAndUpdate(
                {clientId:sender,engineerId:receiver},
                {$push:{
                    messages:{
                        sender:sender,
                        receiver:receiver,
                        message:message
                    }
                }}
            )
            res.status(200).json('message added.')
        }
        else if(client.role==='engineer'){
            await chatModel.findOneAndUpdate(
                {clientId:receiver,engineerId:sender},
                {$push:{
                    messages:{
                        sender:sender,
                        receiver:receiver,
                        message:message
                    }
                }}
            )
            res.status(200).json('message added.')
        }
        else{
            return res.status(400).json('cannot access user details')
        }
    }
    catch(err){
        console.log('error on profileChange',err);
        res.status(500).json('Internal server error');
    }
}

exports.notificationCount = async (req,res)=>{
    try{
        const id = req.user.id
        const client = await signupModel.findOne({_id:id})

        if(!client){
            return res.status(400).json('cannot access user details')
        }

        if(client.role==='client'){
            const chats = await chatModel.find({clientId:client._id})
            if(!chats){
                return res.status(400).json('cannot access chat details')
            }
            let notificationCount=0
    
            chats.map((chat)=>{
                notificationCount+=chat.clientUnread
            })
            
            res.status(200).json(notificationCount)
        }
        else if(client.role==='engineer'){
            const chats = await chatModel.find({engineerId:client._id})
            if(!chats){
                return res.status(400).json('cannot access chat details')
            }
            let notificationCount=0
    
            chats.map((chat)=>{
                notificationCount+=chat.engineerUnread
            })
            
            res.status(200).json(notificationCount)
        }
        else{
            return res.status(400).json('cannot access user details')
        }
    }
    catch(err){
        console.log('error on notificationCount',err);
        res.status(500).json('Internal server error');
    }
}