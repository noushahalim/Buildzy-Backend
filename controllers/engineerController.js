const jwt = require('jsonwebtoken')
const multer = require('../middlewares/multer')
const mongoose = require('mongoose')

const companyModel = require('../models/companyModel')
const signupModel = require('../models/signupModel')
const chatModel= require('../models/chatModel')

exports.companyRegistration = async(req,res)=>{
    try{
        const {companyName,companyEmail,companyMobile,experiance,state,district,description} = req.body
        const id =req.params.id
        const engineer = await signupModel.findOne({_id:id})

        if(!engineer){
            return res.status(400).json('cannot access user details')
        }
        else{
            const logo = req.file.location
            if(!logo){
                return res.status(400).json('cannot access logo details')
            }
            else{
                const logoKey = req.file.key
                const newCompany = new companyModel({
                    engineerId:engineer._id,
                    companyName,
                    companyEmail,
                    companyMobile,
                    experiance,
                    state,
                    district,
                    description,
                    logo:logo,
                    logoKey:logoKey
                })
                await newCompany.save()
                await signupModel.findOneAndUpdate(
                    {_id:id},
                    {$set:{
                        registered:true
                    }}
                )
                const engId = {id:engineer._id}
                const jwtToken= jwt.sign(engId,process.env.JWT_TOKEN_SECRET)
                res.status(200).json({token:jwtToken,role:engineer.role})
            }
        }
    }
    catch(err){
        console.log('error on companyRegistration',err);
        res.status(500).json('Internal server error');
    }
}

exports.companyDetails = async (req,res)=>{
    try{
        const id = req.user.id
        const company = await companyModel.findOne({engineerId:id})

        if(!company){
            return res.status(400).json('cannot access company details')
        }
        else{
            res.status(200).json(company)
        }
    }
    catch(err){
        console.log('error on companyDetails Get',err);
        res.status(500).json('Internal server error');
    }
}

exports.companyUpdation = async(req,res)=>{
    try{
        const {companyName,companyEmail,companyMobile,experiance,state,district,description} = req.body
        const id =req.user.id
        const engineer = await signupModel.findOne({_id:id})

        if(!engineer){
            return res.status(400).json('cannot access user details')
        }
        else{
            if(req.file){
                const company = await companyModel.findOne({engineerId:engineer._id})
                if(company.logoKey){
                    const objKey = company.logoKey
                    multer.deleteImageFromS3(process.env.AWS_BUCKET_NAME,objKey)
                }
                const logo = req.file.location
                const logoKey = req.file.key
                await companyModel.findOneAndUpdate(
                    {engineerId:engineer._id},
                    {$set:{
                        companyName,
                        companyEmail,
                        companyMobile,
                        experiance,
                        state,
                        district,
                        description,
                        logo:logo,
                        logoKey:logoKey
                    }}
                )
                res.status(200).json('company updated')
            }
            else{
                await companyModel.findOneAndUpdate(
                    {engineerId:engineer._id},
                    {$set:{
                        companyName,
                        companyEmail,
                        companyMobile,
                        experiance,
                        state,
                        district,
                        description
                    }}
                )
                res.status(200).json('company updated')
            }
        }
    }
    catch(err){
        console.log('error on companyUpdation',err);
        res.status(500).json('Internal server error');
    }
}

exports.clientChats = async (req,res)=>{
    try{
        const engineerId = req.user.id;
        const clientId = req.params.id;

        const engineer = await signupModel.findById(engineerId)

        if(!engineer){
            return res.status(404).json('engineer not valid');
        }

        if(!clientId){
            return res.status(400).json('ID not valid');
        }

        const chats = await chatModel.findOne({engineerId:engineerId,clientId:clientId});

        if(!chats){
            return res.status(404).json('Cannot access chat details')
        }

        await chatModel.findOneAndUpdate(
            {engineerId:engineerId,clientId:clientId},
            {$set:{
                engineerUnread:0
            }}
        )

        const client = await signupModel.findOne({_id:clientId})

        res.status(200).json({chats:chats,client:client,engineer:engineer._id})
    }
    catch(err){
        console.log('error on companyChats getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.clientChatsList = async (req,res)=>{
    try{
        const engineerId = req.user.id;

        const engineer = await signupModel.findById(engineerId)

        if(!engineer){
            return res.status(404).json('engineer not valid');
        }

        const chatsList = await chatModel.aggregate([
            {
            $match:{engineerId:new mongoose.Types.ObjectId(engineerId)},
            },
            {
                $lookup : {
                    from:'signupdatas',
                    localField:"clientId",
                    foreignField:"_id",
                    as:'clientData'
                }   
            },
            {
              $sort: {
                engineerUnread: -1,
              },
            },
          ])

        if(!chatsList){
            return res.status(404).json('Cannot access chat details')
        }
        res.status(200).json(chatsList)
    }
    catch(err){
        console.log('error on clientChatsList getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.requestAccept = async (req,res)=>{
    try{
        const engineerId = req.user.id;
        const clientId = req.params.id;

        const engineer = await signupModel.findById(engineerId)

        if(!engineer){
            return res.status(404).json('engineer not valid');
        }

        if(!clientId){
            return res.status(400).json('ID not valid');
        }

        const chats = await chatModel.findOne({engineerId:engineerId,clientId:clientId});

        if(!chats){
            return res.status(404).json('Cannot access chat details')
        }

        await chatModel.findOneAndUpdate(
            {engineerId:engineerId,clientId:clientId},
            {$set:{
                status:true,
                clientUnread:1
            }}
        )

        res.status(200).json('accepted')
    }
    catch(err){
        console.log('error on requestAccept getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.clientDetails = async (req,res)=>{
    try{
        const engineerId = req.user.id;
        const clientId = req.params.id;
        const engineer = await signupModel.findOne({_id:engineerId})

        if(!engineer){
            return res.status(400).json('cannot access user details')
        }

        const client = await signupModel.findOne({_id:clientId})

        if(!client){
            return res.status(400).json('cannot access user details')
        }

        res.status(200).json({fullName:client.fullName})
        
    }
    catch(err){
        console.log('error on clientDetails',err);
        res.status(500).json('Internal server error');
    }
}