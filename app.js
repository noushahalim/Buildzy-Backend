const express = require('express')
require('dotenv').config()
const dbConnect = require('./config/connection')

const app = express()
const port = process.env.PORT
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))


dbConnect().then(()=>{
    app.listen(port,()=>{
        console.log(`server is running on ${port}`)
    })
})