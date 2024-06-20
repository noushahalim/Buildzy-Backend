const componyModel= require('../models/componyModel')

exports.componyDatas = async (req,res)=>{
    try{
        const componyDatas= await componyModel.find({status:true})
        res.status(200).json(componyDatas)
    }
    catch(err){
        console.log('error on componyDatas getting',err);
        res.status(500).json('Internal server error');
    }
}