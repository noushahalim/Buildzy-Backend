const signupModel = require("../models/signupModel")
const signupValidation = require("../utilities/signupValidation")
const nodemailer = require('../utilities/otpController')
const otpGenerator = require('otp-generator')
const bcrypt = require("bcrypt")

const generateOtp = ()=>{
    return otpGenerator.generate(4, { 
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false, 
        specialChars: false 
    });
}

exports.clientSignup = async (req,res)=>{
    try{
        const {fullName,mobileNumber,email,password}=req.body
        const existClient = await signupModel.findOne({email})

        if(existClient){
            return res.status(400).json('email already exist')
        }
        else if(!signupValidation.validationFields([fullName,mobileNumber,email,password])){
            return res.status(400).json('All fields are required')
        }
        else if(!signupValidation.emailValidation(email)){
            return res.status(400).json('Invalid email format')
        }
        else if(!signupValidation.mobileValidation(mobileNumber)){
            return res.status(400).json('Invalid mobile number')
        }
        else if(!signupValidation.pwdValidation(password)){
            return res.status(400).json('Invalid password format')
        }
        else{

            const emailOtp = generateOtp()
            
            const mailOptions = {
                from:process.env.NODE_MAILER_GMAIL,
                to:email,
                subject:'Welcome to Buildzy! Verify Your Account',
                text:`Hello,\n\nThank you for signing up for Buildzy. Your OTP code for account verification is: ${emailOtp}.\n\nPlease enter this code on the verification page to complete your registration.\n\nIf you did not request this code, please ignore this email.\n\nThank you,\nThe Buildzy Team`,
                html: `<!DOCTYPE html>
                <html>
                <head>
                    <title>Buildzy OTP Verification</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f9f9f9;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                            background-color: #ffffff;
                            box-sizing: border-box;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .content {
                            font-size: 16px;
                            line-height: 1.5;
                            word-wrap: break-word;
                        }
                        .otp-code {
                            font-size: 24px;
                            font-weight: bold;
                            color: #333;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .footer {
                            font-size: 14px;
                            color: #777;
                            text-align: center;
                            margin-top: 20px;
                        }
                        @media only screen and (max-width: 600px) {
                            .container {
                                padding: 15px;
                            }
                            .content {
                                font-size: 14px;
                            }
                            .otp-code {
                                font-size: 20px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Buildzy</h2>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>Thank you for signing up for Buildzy. Your OTP code for account verification is:</p>
                            <div class="otp-code">${emailOtp}</div>
                            <p>Please enter this code on the verification page to complete your registration.</p>
                            <p>If you did not request this code, please ignore this email.</p>
                            <p>Thank you,<br>The Buildzy Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Buildzy. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>`
            }

            nodemailer.sentMailOtp(mailOptions)

            // Generate a random salt
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds)
    
            // Hash the password with the generated salt
            const hasedPassword = await bcrypt.hash(password, salt)
            
            const newClient = new signupModel({
                fullName,
                mobileNumber,
                email,
                password:hasedPassword,
                role:'client',
                otp:emailOtp
            })
            const client = await newClient.save()

            res.status(200).json({clientId:client._id,email:client.email})

        }
    }
    catch(err){
        console.log('error on clientSignup',err)
        res.status(500).json('Internal server error');
    }
}

exports.engineerSignup = async (req,res)=>{
    try{
        const {fullName,mobileNumber,email,password}=req.body

        const existEngineer = await signupModel.findOne({email})

        if(existEngineer){
            return res.status(400).json('email already exist')
        }
        else if(!signupValidation.validationFields([fullName,mobileNumber,email,password])){
            return res.status(400).json('All fields are required')
        }
        else if(!signupValidation.emailValidation(email)){
            return res.status(400).json('Invalid email format')
        }
        else if(!signupValidation.mobileValidation(mobileNumber)){
            return res.status(400).json('Invalid mobile number')
        }
        else if(!signupValidation.pwdValidation(password)){
            return res.status(400).json('Invalid password format')
        }
        else{
            const emailOtp = generateOtp()
            
            const mailOptions = {
                from:process.env.NODE_MAILER_GMAIL,
                to:email,
                subject:'Welcome to Buildzy! Verify Your Account',
                text:`Hello,\n\nThank you for signing up for Buildzy. Your OTP code for account verification is: ${emailOtp}.\n\nPlease enter this code on the verification page to complete your registration.\n\nIf you did not request this code, please ignore this email.\n\nThank you,\nThe Buildzy Team`,
                html: `<!DOCTYPE html>
                <html>
                <head>
                    <title>Buildzy OTP Verification</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f9f9f9;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                            background-color: #ffffff;
                            box-sizing: border-box;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .content {
                            font-size: 16px;
                            line-height: 1.5;
                            word-wrap: break-word;
                        }
                        .otp-code {
                            font-size: 24px;
                            font-weight: bold;
                            color: #333;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .footer {
                            font-size: 14px;
                            color: #777;
                            text-align: center;
                            margin-top: 20px;
                        }
                        @media only screen and (max-width: 600px) {
                            .container {
                                padding: 15px;
                            }
                            .content {
                                font-size: 14px;
                            }
                            .otp-code {
                                font-size: 20px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Buildzy</h2>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>Thank you for signing up for Buildzy. Your OTP code for account verification is:</p>
                            <div class="otp-code">${emailOtp}</div>
                            <p>Please enter this code on the verification page to complete your registration.</p>
                            <p>If you did not request this code, please ignore this email.</p>
                            <p>Thank you,<br>The Buildzy Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Buildzy. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>`
            }

            nodemailer.sentMailOtp(mailOptions)

            // Generate a random salt
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds)
    
            // Hash the password with the generated salt
            const hasedPassword = await bcrypt.hash(password, salt)

            const newEngineer = new signupModel({
                fullName,
                mobileNumber,
                email,
                password:hasedPassword,
                role:'engineer',
                otp:emailOtp
            })
            const engineer = await newEngineer.save()
            res.status(200).json({engineerId:engineer._id,email:engineer.email})
        }
    }
    catch(err){
        console.log('error on engineerSignup',err);
        res.status(500).json('Internal server error');
    }
}


exports.signupOtpVerification = async(req,res)=>{
    try{
        const {otp,id}=req.body
        const client = await signupModel.findOne({_id:id})
        if(!client){
            return res.status(400).json('user details not getting')
        }
        else{
            if(client.otp!==otp){
                return res.status(400).json('Invalid otp')
            }
            else{
                await signupModel.findOneAndUpdate(
                    {_id:id},
                    {
                        status:'verified',
                        otp:''
                    }
                )
                res.status(200).json('verified')
            }
        }
    }
    catch(err){
        console.log('error on signupOtpValidation',err);
        res.status(500).json('Internal server error');
    }
}

exports.signupResendOtp = async(req,res)=>{
    try{
        const id=req.body.id
        const client = await signupModel.findOne({_id:id})
        if(!client){
            return res.status(400).json('user details not getting')
        }
        else{
            const emailOtp = generateOtp()
            
            const mailOptions = {
                from:process.env.NODE_MAILER_GMAIL,
                to:client.email,
                subject:'Welcome to Buildzy! Verify Your Account',
                text:`Hello,\n\nThank you for signing up for Buildzy. Your OTP code for account verification is: ${emailOtp}.\n\nPlease enter this code on the verification page to complete your registration.\n\nIf you did not request this code, please ignore this email.\n\nThank you,\nThe Buildzy Team`,
                html: `<!DOCTYPE html>
                <html>
                <head>
                    <title>Buildzy OTP Verification</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f9f9f9;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                            background-color: #ffffff;
                            box-sizing: border-box;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .content {
                            font-size: 16px;
                            line-height: 1.5;
                            word-wrap: break-word;
                        }
                        .otp-code {
                            font-size: 24px;
                            font-weight: bold;
                            color: #333;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .footer {
                            font-size: 14px;
                            color: #777;
                            text-align: center;
                            margin-top: 20px;
                        }
                        @media only screen and (max-width: 600px) {
                            .container {
                                padding: 15px;
                            }
                            .content {
                                font-size: 14px;
                            }
                            .otp-code {
                                font-size: 20px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Buildzy</h2>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>Thank you for signing up for Buildzy. Your OTP code for account verification is:</p>
                            <div class="otp-code">${emailOtp}</div>
                            <p>Please enter this code on the verification page to complete your registration.</p>
                            <p>If you did not request this code, please ignore this email.</p>
                            <p>Thank you,<br>The Buildzy Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Buildzy. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>`
            }

            nodemailer.sentMailOtp(mailOptions)

            await signupModel.findOneAndUpdate(
                {_id:id},
                {
                    otp:emailOtp
                }
            )
            res.status(200).json('otp resented')
            
        }
    }
    catch(err){
        console.log('error on signupResendOtp',err);
        res.status(500).json('Internal server error');
    }
}