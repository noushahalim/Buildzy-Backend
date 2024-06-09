const express = require('express')
const commonRouter = express.Router()
const authController = require('../controllers/authController')

commonRouter.post('/signupOtpVerification',authController.signupOtpVerification)
commonRouter.post('/signupResendOtp',authController.signupResendOtp)
commonRouter.post('/forgotPassword',authController.forgotPassword)
commonRouter.post('/forgotOtpVerification',authController.forgotOtpVerification)
commonRouter.post('/forgotResendOtp',authController.forgotResendOtp)
commonRouter.post('/changePassword',authController.changePassword)

module.exports = commonRouter