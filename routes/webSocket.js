const { watchMan } = require("../services/fileWatcherService");
const path = require('path');
const os = require('os');

function webSocketConnections(io) {
    io.on('connection', (socket) => {
        console.log('A user connected',socket.id);
        socket.emit('message',  msg = "Connection successfull" );

        // Handle messages from the client
        socket.on('message', (data) => {
            if (Array.isArray(data.path) && data.path.length === 0 ) {
                let downloadDir = path.join(os.homedir(), 'Downloads');
                data.path = [downloadDir];
                watchMan(data, socket);
            }
            else{
                watchMan(data, socket);
            }
        });

        function sendMessage(filePath,flag){
            socket.emit('ownerCheck', { filePath, matched: true,flag });
        }
        webSocketConnections.sendMessage = sendMessage;
        // Handle disconnections
        socket.on('disconnect', () => {
            console.log('User disconnected',socket.id);
        });
    });
}

module.exports = { webSocketConnections };
