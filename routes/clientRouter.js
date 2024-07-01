const express = require('express')
const clientRouter = express.Router()
const jwtAuthentication = require('../middlewares/jwtAuthentication')

const authController = require('../controllers/authController')
const clientController = require('../controllers/clientController')

clientRouter.post('/signup',authController.clientSignup)
clientRouter.get('/companyDatas',clientController.companyDatas)
clientRouter.get('/companyDetails/:id',clientController.companyDetails)
clientRouter.get('/companyConnect/:id',jwtAuthentication,clientController.companyConnect)
clientRouter.get('/companyChats/:id',jwtAuthentication,clientController.companyChats)
clientRouter.get('/companyChatsList',jwtAuthentication,clientController.companyChatsList)

module.exports = clientRouter