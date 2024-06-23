const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    engineerId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    clientId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    status:{
        type:Boolean,
        default:false
    }
})

const chatModel = mongoose.model('chatDatas',chatSchema)

module.exports = chatModel