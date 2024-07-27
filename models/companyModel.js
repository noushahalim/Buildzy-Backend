const mongoose = require('mongoose')

const companySchema = mongoose.Schema({
    engineerId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    companyEmail:{
        type:String,
        required:true
    },
    companyMobile:{
        type:Number,
        required:true
    },
    experiance:{
        type:Number,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        required:true
    },
    logoKey:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:true
    },
    rating:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const companyModel = mongoose.model('companyDatas',companySchema)

module.exports = companyModel