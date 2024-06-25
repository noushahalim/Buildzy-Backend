const componyModel = require('../models/componyModel')
const signupModel = require('../models/signupModel')
const chatModel= require('../models/chatModel')
const jwt = require('jsonwebtoken')
const multer = require('../middlewares/multer')

exports.componyRegistration = async(req,res)=>{
    try{
        const {componyName,componyEmail,componyMobile,experiance,state,district,description} = req.body
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
                const newCompony = new componyModel({
                    engineerId:engineer._id,
                    componyName,
                    componyEmail,
                    componyMobile,
                    experiance,
                    state,
                    district,
                    description,
                    logo:logo,
                    logoKey:logoKey
                })
                await newCompony.save()
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
        console.log('error on componyRegistration',err);
        res.status(500).json('Internal server error');
    }
}

exports.componyDetails = async (req,res)=>{
    try{
        const id = req.user.id
        const compony = await componyModel.findOne({engineerId:id})

        if(!compony){
            return res.status(400).json('cannot access compony details')
        }
        else{
            res.status(200).json(compony)
        }
    }
    catch(err){
        console.log('error on componyDetails Get',err);
        res.status(500).json('Internal server error');
    }
}

exports.componyUpdation = async(req,res)=>{
    try{
        const {componyName,componyEmail,componyMobile,experiance,state,district,description} = req.body
        const id =req.user.id
        const engineer = await signupModel.findOne({_id:id})

        if(!engineer){
            return res.status(400).json('cannot access user details')
        }
        else{
            if(req.file){
                const compony = await componyModel.findOne({engineerId:engineer._id})
                if(compony.logoKey){
                    const objKey = compony.logoKey
                    multer.deleteImageFromS3(process.env.AWS_BUCKET_NAME,objKey)
                }
                const logo = req.file.location
                const logoKey = req.file.key
                await componyModel.findOneAndUpdate(
                    {engineerId:engineer._id},
                    {$set:{
                        componyName,
                        componyEmail,
                        componyMobile,
                        experiance,
                        state,
                        district,
                        description,
                        logo:logo,
                        logoKey:logoKey
                    }}
                )
                res.status(200).json('compony updated')
            }
            else{
                await componyModel.findOneAndUpdate(
                    {engineerId:engineer._id},
                    {$set:{
                        componyName,
                        componyEmail,
                        componyMobile,
                        experiance,
                        state,
                        district,
                        description
                    }}
                )
                res.status(200).json('compony updated')
            }
        }
    }
    catch(err){
        console.log('error on componyUpdation',err);
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

        const client = await signupModel.findOne({_id:clientId})

        res.status(200).json({chats:chats,client:client,engineer:engineer._id})
    }
    catch(err){
        console.log('error on componyChats getting',err);
        res.status(500).json('Internal server error');
    }
}