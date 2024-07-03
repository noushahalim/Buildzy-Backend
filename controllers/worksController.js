const signUpModel = require('../models/signupModel')
const workRequestModel = require('../models/workRequestModel')
const companyModel = require('../models/companyModel')
const chatModel = require('../models/chatModel')

exports.submitWorkRequest = async(req,res)=>{
    try{
        const {projectTitle,projectDescription,projectLocation,projectType,startDate,endDate,clientId,estimatedCost,milestones} = req.body
        console.log(req.body);
        const engineerId =req.user.id
        const engineer = await signUpModel.findOne({_id:engineerId})

        if(!engineer){
            return res.status(400).json('cannot access user details')
        }

        const client = await signUpModel.findOne({_id:clientId})
        if(!client){
            return res.status(400).json('cannot access user details')
        }

        const company = await companyModel.findOne({engineerId:engineerId})
        if(!company){
            return res.status(400).json('cannot access company details')
        }

        const milestoneObjects = milestones.map((description, index) => ({
            description,
            status: index === 0
        }));

        const newWorkRequest = new workRequestModel({
            projectTitle,
            projectDescription,
            projectLocation,
            projectType,
            startDate,
            endDate,
            clientName:client.fullName,
            estimatedCost,
            milestones:milestoneObjects,
            engineerId:engineer._id,
            clientId:client._id,
            companyName:company.companyName
        })

        await newWorkRequest.save()

        await chatModel.findOneAndUpdate(
            {clientId:client._id,engineerId:engineer._id},
            {$push:{
                messages:{
                    sender:engineer._id,
                    receiver:client._id,
                    message:`Dear ${client.fullName}, 
                            We are pleased to inform you that a new work request has been submitted for your consideration. The details of the proposed project can be reviewed on our Company Details page.
                            To proceed with this work request, please review the submission and choose to either agree to the proposal or delete it.
                            Thank you for your attention.
                            Best regards,
                            ${company.companyName}`
                }
            }},
            {$inc:{
                clientUnread:1
            }}
        )

        res.status(200).json('Work Request submited')
    }
    catch(err){
        console.log('error on submitWorkRequest',err);
        res.status(500).json('Internal server error');
    }
}

exports.workRequests = async (req,res)=>{
    try{
        const clientId = req.user.id;
        const client = await signUpModel.findById(clientId)
        if(!client){
            return res.status(404).json('client not valid');
        }

        const engineerId = req.params.id;
        const engineer = await signUpModel.findById(engineerId)
        if(!engineer){
            return res.status(404).json('engineer not valid');
        }

        const workRequests = await workRequestModel.find({clientId:client._id,engineerId:engineer._id,status:false})
        if(!workRequests){
            return res.status(404).json('Cannot access workRequests details')
        }

        res.status(200).json(workRequests)
    }
    catch(err){
        console.log('error on workRequests getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.agreeWorkRequest = async (req,res)=>{
    try{
        const clientId = req.user.id;
        const client = await signUpModel.findById(clientId)
        if(!client){
            return res.status(404).json('client not valid');
        }

        const workId = req.params.id;
        const work = await workRequestModel.findById(workId)
        if(!work){
            return res.status(404).json('Cannot access workRequests details');
        }

        await workRequestModel.findOneAndUpdate(
            {_id:work._id},
            {$set:{
                status:true
            }}
        )

        res.status(200).json('success')
    }
    catch(err){
        console.log('error on workRequests getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.deleteWorkRequest=async (req,res)=>{
    try{
        const id=req.params.id
        const deleteWorkRequest=await workRequestModel.findByIdAndDelete({_id:id})
        if(deleteWorkRequest){
            res.status(200).json('Work Request Deleted')
        }
        else{
            res.status(404).json('cant access work details.')
        }
    }catch(err){
        console.log("error when delete WorkRequest",err);
    }
}

exports.workDetails = async (req,res)=>{
    try{
        const clientId = req.user.id;
        const client = await signUpModel.findById(clientId)
        if(!client){
            return res.status(404).json('client not valid');
        }

        const workRequestId = req.params.id;
        const workRequest = await workRequestModel.findOne({_id:workRequestId,clientId:client._id})
        if(!workRequest){
            return res.status(404).json('workRequest not valid');
        }

        res.status(200).json(workRequest)
    }
    catch(err){
        console.log('error on workRequestDetails getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.works = async (req,res)=>{
    try{
        const clientId = req.user.id;
        const client = await signUpModel.findById(clientId)
        if(!client){
            return res.status(404).json('client not valid');
        }

        const works = await workRequestModel.find({clientId:client._id,status:true})
        if(!works){
            return res.status(404).json('Cannot access works details')
        }

        res.status(200).json(works)
    }
    catch(err){
        console.log('error on works getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.engineerWorks = async (req,res)=>{
    try{
        const engineerId = req.user.id;
        const engineer = await signUpModel.findById(engineerId)
        if(!engineer){
            return res.status(404).json('engineer not valid');
        }

        const works = await workRequestModel.find({engineerId:engineer._id,status:true})
        if(!works){
            return res.status(404).json('Cannot access works details')
        }

        res.status(200).json(works)
    }
    catch(err){
        console.log('error on engineerWorks getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.engineerWorkDetails = async (req,res)=>{
    try{
        const engineerId = req.user.id;
        const engineer = await signUpModel.findById(engineerId)
        if(!engineer){
            return res.status(404).json('engineer not valid');
        }

        const workRequestId = req.params.id;
        const workRequest = await workRequestModel.findOne({_id:workRequestId,engineerId:engineer._id})
        if(!workRequest){
            return res.status(404).json('workRequest not valid');
        }

        res.status(200).json(workRequest)
    }
    catch(err){
        console.log('error on workRequestDetails getting',err);
        res.status(500).json('Internal server error');
    }
}

exports.updateMilestones = async(req,res)=>{
    try{
        const {workId,milestones} = req.body
        const id =req.user.id

        const engineer = await signUpModel.findOne({_id:id})
        if(!engineer){
            return res.status(400).json('cannot access user details')
        }

        const work = await workRequestModel.findById(workId)
        if(!work){
            return res.status(400).json('cannot access work details')
        }

        for (let milestone of milestones){
            await workRequestModel.findOneAndUpdate(
                {_id:workId , "milestones._id": milestone._id},
                {$set:{"milestones.$.status":milestone.status}}
            )
        }

        res.status(200).json('Milestones updated successfully');
    }
    catch(err){
        console.log('error on companyUpdation',err);
        res.status(500).json('Internal server error');
    }
}