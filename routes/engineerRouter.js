const express = require('express')
const engineerRouter = express.Router()
const multer = require('../middlewares/multer')
const jwtAuthentication = require('../middlewares/jwtAuthentication')

const authController = require('../controllers/authController')
const engineerController = require('../controllers/engineerController')

engineerRouter.post('/signup',authController.engineerSignup)
engineerRouter.post("/componyRegistration/:id",multer.upload.single('image'),engineerController.componyRegistration)
engineerRouter.get("/componyDetails", jwtAuthentication, engineerController.componyDetails)
engineerRouter.post("/componyUpdation", jwtAuthentication,multer.upload.single('image'),engineerController.componyUpdation)
engineerRouter.get('/clientChats/:id',jwtAuthentication,engineerController.clientChats)
engineerRouter.get('/clientChatsList',jwtAuthentication,engineerController.clientChatsList)
engineerRouter.get('/requestAccept/:id',jwtAuthentication,engineerController.requestAccept)

module.exports = engineerRouter