const express = require('express')
const engineerRouter = express.Router()
const multer = require('../middlewares/multer')
const jwtAuthentication = require('../middlewares/jwtAuthentication')

const authController = require('../controllers/authController')
const engineerController = require('../controllers/engineerController')
const worksController = require('../controllers/worksController')

engineerRouter.post('/signup',authController.engineerSignup)
engineerRouter.post("/companyRegistration/:id",multer.upload.single('image'),engineerController.companyRegistration)
engineerRouter.get("/companyDetails", jwtAuthentication, engineerController.companyDetails)
engineerRouter.post("/companyUpdation", jwtAuthentication,multer.upload.single('image'),engineerController.companyUpdation)
engineerRouter.get('/clientChats/:id',jwtAuthentication,engineerController.clientChats)
engineerRouter.get('/clientChatsList',jwtAuthentication,engineerController.clientChatsList)
engineerRouter.get('/requestAccept/:id',jwtAuthentication,engineerController.requestAccept)
engineerRouter.get('/clientDetails/:id',jwtAuthentication,engineerController.clientDetails)
engineerRouter.post("/submitWorkRequest", jwtAuthentication,worksController.submitWorkRequest)
engineerRouter.get('/engineerWorks',jwtAuthentication,worksController.engineerWorks)
engineerRouter.get('/engineerWorkDetails/:id',jwtAuthentication,worksController.engineerWorkDetails)
engineerRouter.post("/updateMilestones", jwtAuthentication,worksController.updateMilestones)
engineerRouter.get('/invoiceDetails/:id',jwtAuthentication,worksController.invoiceDetailsEngineer)

module.exports = engineerRouter