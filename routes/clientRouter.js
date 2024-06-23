const express = require('express')
const clientRouter = express.Router()
const jwtAuthentication = require('../middlewares/jwtAuthentication')

const authController = require('../controllers/authController')
const clientController = require('../controllers/clientController')

clientRouter.post('/signup',authController.clientSignup)
clientRouter.get('/componyDatas',clientController.componyDatas)
clientRouter.get('/componyDetails/:id',clientController.componyDetails)
clientRouter.get('/componyConnect/:id',jwtAuthentication,clientController.componyConnect)
clientRouter.get('/componyChats/:id',jwtAuthentication,clientController.componyChats)

module.exports = clientRouter