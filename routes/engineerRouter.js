const express = require('express')
const engineerRouter = express.Router()
const multer = require('../middlewares/multer')
const jwtAuthentication = require('../middlewares/jwtAuthentication')

const authController = require('../controllers/authController')
const engineerController = require('../controllers/engineerController')

engineerRouter.post('/signup',authController.engineerSignup)
engineerRouter.post("/companyRegistration/:id",multer.upload.single('image'),engineerController.companyRegistration)
engineerRouter.get("/companyDetails", jwtAuthentication, engineerController.companyDetails)
engineerRouter.post("/companyUpdation", jwtAuthentication,multer.upload.single('image'),engineerController.companyUpdation)
engineerRouter.get('/clientChats/:id',jwtAuthentication,engineerController.clientChats)
engineerRouter.get('/clientChatsList',jwtAuthentication,engineerController.clientChatsList)
engineerRouter.get('/requestAccept/:id',jwtAuthentication,engineerController.requestAccept)
engineerRouter.get('/clientDetails/:id',jwtAuthentication,engineerController.clientDetails)
engineerRouter.post("/submitWorkRequest", jwtAuthentication,engineerController.submitWorkRequest)

module.exports = engineerRouter