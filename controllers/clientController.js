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

exports.componyDetails = async (req,res)=>{
    try{
        const id = req.params.id;

        if(!id){
            return res.status(400).json('ID not valid');
        }

        const compony = await componyModel.findById(id);

        if(!compony){
            return res.status(404).json('Cannot access compony details')
        }

        res.status(200).json(compony)
    }
    catch(err){
        console.log('error on componyDetails getting',err);
        res.status(500).json('Internal server error');
    }
}