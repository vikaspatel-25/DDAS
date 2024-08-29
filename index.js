const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Router = require('./routes/routes.index')
const {watchMan} = require("./services/fileWatcherService")
const {webSocketConnections} = require("./routes/webSocket")

//setup express server
const PORT = 8003;
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/",Router)


//creating hhtp server and attaching express app to it
const server = http.createServer(app);

//attach socket.io to server
const io  = socketIo(server)

//managing websocketConnections
webSocketConnections(io);

server.listen(PORT, () => { console.log(`Server started at Port ${PORT}`) });