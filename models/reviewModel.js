const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    companyId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    clientId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const reviewModel = mongoose.model('reviewModel',reviewSchema)

module.exports = reviewModel