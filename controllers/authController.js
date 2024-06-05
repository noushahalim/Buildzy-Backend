const clientSignupModel = require("../models/clientSignupModel")
const engineerSignupModel = require("../models/engineerSignupModel")

exports.clientSignup = async (req,res)=>{
    try{
        const {fullName,mobileNumber,email,password}=req.body
        const newUser = new clientSignupModel({
            fullName,
            mobileNumber,
            email,
            password
        })
        await newUser.save()
        res.status(200).json('user registerd Successfull')
    }
    catch(err){
        console.log('error on clientSignup',err)
    }
}

exports.engineerSignup = async (req,res)=>{
    try{
        const {fullName,mobileNumber,email,password}=req.body
        const newEngineer = new engineerSignupModel({
            fullName,
            mobileNumber,
            email,
            password
        })
        await newEngineer.save()
        res.status(200).json('engineer registerd Successfull')
    }
    catch(err){
        console.log('error on engineerSignup',err)
    }
}