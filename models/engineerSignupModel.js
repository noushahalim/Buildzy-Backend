const mongoose = require('mongoose')

const signupSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const engineerSignupModel = mongoose.model('engineerSignupDatas',signupSchema)

module.exports = engineerSignupModel