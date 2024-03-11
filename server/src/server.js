require('dotenv').config;
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const server = http.createServer(app);

const io = socketIo(server,{
    cors: {
        origin: '*', // Change this to your desired origin
        methods: ['GET', 'POST'] // Allow the methods you need
    }
});

io.on("connection",(socket)=>{
    console.log("user connected: "+socket.id);

    socket.on('join_room',(room)=>{
        socket.join(room);
        console.log(`user ID ${socket.id} joined room ${room}`);
    });

    socket.on("send_message",(data)=>{
        console.log(data)
        socket.to(data.room).emit("received_message",data)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected'+socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});