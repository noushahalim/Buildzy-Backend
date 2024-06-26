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