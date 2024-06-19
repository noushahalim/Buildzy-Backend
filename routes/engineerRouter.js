const express = require('express')
const engineerRouter = express.Router()
const multer = require('../middlewares/multer')
const authController = require('../controllers/authController')
const engineerController = require('../controllers/engineerController')

engineerRouter.post('/signup',authController.engineerSignup)
engineerRouter.post("/componyRegistration/:id",multer.upload.single('image'),engineerController.componyRegistration)

module.exports = engineerRouter