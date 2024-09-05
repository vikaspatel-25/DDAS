const { app } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

// Function to start the Node.js server
function startServer() {
    const serverProcess = spawn('node', [path.join(__dirname, 'index.js')], {
        stdio: 'inherit', // This will pipe the server logs to the Electron process
    });

    serverProcess.on('close', (code) => {
        console.log(`Server process exited with code ${code}`);
    });

    serverProcess.on('error', (err) => {
        console.error('Failed to start server:', err);
    });
}

app.on('ready', () => {
    startServer();
    console.log('Electron app is ready and the server is running.');
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
