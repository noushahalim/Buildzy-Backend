const express = require('express')
const multer = require('../middlewares/multer')

const jwtAuthentication = require('../middlewares/jwtAuthentication')
const commonRouter = express.Router()
const authController = require('../controllers/authController')

commonRouter.post('/signupOtpVerification',authController.signupOtpVerification)
commonRouter.post('/signupResendOtp',authController.signupResendOtp)
commonRouter.post('/forgotPassword',authController.forgotPassword)
commonRouter.post('/forgotOtpVerification',authController.forgotOtpVerification)
commonRouter.post('/forgotResendOtp',authController.forgotResendOtp)
commonRouter.post('/changePassword',authController.changePassword)
commonRouter.post('/login',authController.login)
commonRouter.post('/profileChange',jwtAuthentication,multer.single('image'),authController.profileChange)

module.exports = commonRouter