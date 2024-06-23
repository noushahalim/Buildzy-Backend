const componyModel= require('../models/componyModel')
const signUpModel= require('../models/signupModel')
const chatModel= require('../models/chatModel')

exports.componyDatas = async (req,res)=>{
    try{
        const componyDatas= await componyModel.find({status:true})
        res.status(200).json(componyDatas)
    }
    catch(err){
        console.log('error on componyDatas getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.componyDetails = async (req,res)=>{
    try{
        const id = req.params.id;

        if(!id){
            return res.status(400).json('ID not valid');
        }

        const compony = await componyModel.findById(id);

        if(!compony){
            return res.status(404).json('Cannot access compony details')
        }

        res.status(200).json(compony)
    }
    catch(err){
        console.log('error on componyDetails getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.componyConnect = async (req,res)=>{
    try{
        const clientId =req.user.id
        const engineerId = req.params.id;

        if(!engineerId){
            return res.status(400).json('ID not valid');
        }

        const engineer = await signUpModel.findById(engineerId);

        if(!engineer || engineer.role !== 'engineer'){
            return res.status(404).json('Cannot access engineer details')
        }

        const newChat = new chatModel({
            engineerId:engineer._id,
            clientId:clientId
        })
        await newChat.save()
        res.status(200).json('connected successfully')
    }
    catch(err){
        console.log('error on componyConnect',err);
        res.status(500).json('Internal server error');
    }
}

exports.componyChats = async (req,res)=>{
    try{
        const clientId = req.user.id;
        const engineerId = req.params.id;

        const client = await signUpModel.findById(clientId)

        if(!client){
            return res.status(404).json('client not valid');
        }

        if(!engineerId){
            return res.status(400).json('ID not valid');
        }

        const chats = await chatModel.findOne({engineerId:engineerId,clientId:clientId});

        if(!chats){
            return res.status(404).json('Cannot access chat details')
        }

        const compony = await componyModel.findOne({engineerId:engineerId})

        res.status(200).json({chats:chats,compony:compony})
    }
    catch(err){
        console.log('error on componyChats getting',err);
        res.status(500).json('Internal server error');
    }
}