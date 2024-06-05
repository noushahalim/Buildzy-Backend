const express = require('express')
require('dotenv').config()
const dbConnect = require('./config/connection')

const app = express()
const port = process.env.PORT
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))

//for client route
const client=require("./routes/clientRouter")
app.use("/client",client)

//for engineer route
const engineer = require("./routes/engineerRouter")
app.use("/engineer",engineer)


dbConnect().then(()=>{
    app.listen(port,()=>{
        console.log(`server is running on ${port}`)
    })
})