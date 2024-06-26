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
    messages:{
        type:[{
            sender:{
                type:String
            },
            receiver:{
                type:String
            },
            message:{
                type:String
            },
            time:{
                type:Date,
                default:Date.now
            }
        }]
    },
    status:{
        type:Boolean,
        default:false
    }
})

const chatModel = mongoose.model('chatDatas',chatSchema)

module.exports = chatModel