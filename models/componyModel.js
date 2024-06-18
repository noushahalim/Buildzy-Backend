const mongoose = require('mongoose')

const componySchema = mongoose.Schema({
    engineerId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    componyName:{
        type:String,
        required:true
    },
    componyEmail:{
        type:String,
        required:true
    },
    componyMobile:{
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
    status:{
        type:String,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const componyModel = mongoose.model('componyDatas',componySchema)

module.exports = componyModel