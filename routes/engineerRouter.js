const express = require('express')
const engineerRouter = express.Router()
const authController = require('../controllers/authController')

engineerRouter.post('/signup',authController.engineerSignup)

module.exports = engineerRouter