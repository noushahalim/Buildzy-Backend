const express = require('express')
const commonRouter = express.Router()
const authController = require('../controllers/authController')

commonRouter.post('/signupOtpVerification',authController.signupOtpVerification)
commonRouter.post('/signupResendOtp',authController.signupResendOtp)

module.exports = commonRouter