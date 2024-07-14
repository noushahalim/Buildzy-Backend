const express = require('express')
// Import Server from socket.io module
const { Server } = require('socket.io');
require('dotenv').config()
const dbConnect = require('./config/connection')
const cors = require('cors')

const app = express();
const server = require('http').createServer(app);

const io = new Server(server,{
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    },
})

const port = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))

//for common route
const common=require("./routes/commonRouter")
app.use("/",common)

//for client route
const client=require("./routes/clientRouter")
app.use("/client",client)

//for engineer route
const engineer = require("./routes/engineerRouter")
app.use("/engineer",engineer)

// WebSocket connection
const socketio = require("./utilities/socketio")
socketio.socketio(io)

dbConnect().then(()=>{
    server.listen(port,()=>{
        console.log(`server is running on ${port}`)
    })
}).catch((err) => {
    console.error('Database connection failed:', err);
});