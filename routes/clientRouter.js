const express = require('express')
const clientRouter = express.Router()
const authController = require('../controllers/authController')
const clientController = require('../controllers/clientController')

clientRouter.post('/signup',authController.clientSignup)
clientRouter.get('/componyDatas',clientController.componyDatas)
clientRouter.get('/componyDetails/:id',clientController.componyDetails)

module.exports = clientRouter