const mongoose = require('mongoose')
const companyModel= require('../models/companyModel')
const signUpModel= require('../models/signupModel')
const chatModel= require('../models/chatModel')

exports.companyDatas = async (req,res)=>{
    try{
        const companyDatas= await companyModel.find({status:true})
        res.status(200).json(companyDatas)
    }
    catch(err){
        console.log('error on companyDatas getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.companyDetails = async (req,res)=>{
    try{
        const id = req.params.id;

        if(!id){
            return res.status(400).json('ID not valid');
        }

        const company = await companyModel.findById(id);

        if(!company){
            return res.status(404).json('Cannot access company details')
        }

        res.status(200).json(company)
    }
    catch(err){
        console.log('error on companyDetails getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.companyConnect = async (req,res)=>{
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
            clientId:clientId,
            engineerUnread:1
        })
        await newChat.save()
        res.status(200).json('connected successfully')
    }
    catch(err){
        console.log('error on companyConnect',err);
        res.status(500).json('Internal server error');
    }
}

exports.companyChats = async (req,res)=>{
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

        await chatModel.findOneAndUpdate(
            {engineerId:engineerId,clientId:clientId},
            {$set:{
                clientUnread:0
            }}
        )

        const company = await companyModel.findOne({engineerId:engineerId})

        res.status(200).json({chats:chats,company:company,client:client._id})
    }
    catch(err){
        console.log('error on companyChats getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.companyChatsList = async (req,res)=>{
    try{
        const clientId = req.user.id;

        const client = await signUpModel.findById(clientId)

        if(!client){
            return res.status(404).json('client not valid');
        }

        const chatsList = await chatModel.aggregate([
            {
            $match:{clientId:new mongoose.Types.ObjectId(clientId)},
            },
            {
                $lookup : {
                    from:'companydatas',
                    localField:"engineerId",
                    foreignField:"engineerId",
                    as:'companyData'
                }   
            },
            {
              $sort: {
                clientUnread: -1,
              },
            },
          ])

        if(!chatsList){
            return res.status(404).json('Cannot access chat details')
        }
        res.status(200).json(chatsList)
    }
    catch(err){
        console.log('error on companyChatsList getting',err);
        res.status(500).json('Internal server error');
    }
}