const multer = require('multer')
const multerS3 = require('multer-s3')
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3')

s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

exports.upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req,file,cb){
            cb(null, {fieldName:file.fieldName});
        },
        key: function (req,file,cb){
            cb(null, Date.now().toString()+''+file.originalname)
        }
    })
})

exports.deleteImageFromS3 = async(bucketName, objKey)=>{
    try{
        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: objKey
        });

        await s3.send(deleteCommand);
    }
    catch(err){
        console.log('error deleting image:',err);
    }
}