const componyModel = require('../models/componyModel')
const signupModel = require('../models/signupModel')
const jwt = require('jsonwebtoken')

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