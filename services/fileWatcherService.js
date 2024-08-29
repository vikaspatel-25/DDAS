const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const { checkDuplicate, removeLog } = require("./duplicateDetection");
const { logMetaData } = require("../middleware/logger");
const { generateFileHash } = require('./hashGenerator');
const { checkOwner } = require("./checkOwner");

// Defining the downloads directory
async function watchMan(data, socket) {
    // Setup watcher
    const watcher = chokidar.watch(data.path, {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        ignoreInitial: true,
    });

    // Watcher events
    watcher.on('add', async (filePath) => {
        // Filepath will be automatically sent as prop by chokidar library containing details about the file.
        const filename = path.basename(filePath);
        try {
            // Ignoring temp files created during the download process
            if (filename.endsWith('.tmp') ||
                filename.endsWith('.crdownload') ||
                filename.endsWith('.part') ||
                filename.endsWith('.download') ||
                filename.startsWith('~') ||
                filename.startsWith('.') ||
                filename.startsWith('~$') ||
                filename.endsWith('.lock')) {
                return;
            }

            const hash = generateFileHash(filePath);
            if (checkDuplicate(hash)) {
                const ownerMatches = await checkOwner(filePath, data.username);
                if (ownerMatches) {
                    socket.emit('ownerCheck', { filePath, matched: true });
                } else {
                    socket.emit('ownerCheck', { filePath, matched: false });
                }
            } else {
                logMetaData(filePath);
                console.log(`Logged file: ${filename}`);
            }
        } catch (error) {
            console.log("Something went wrong");
            console.log(error);
        }
    });

    watcher.on('unlink', (fileData) => {
        try {
            const filename = path.basename(fileData);

            // Ignoring temp files created during the download process
            if (filename.endsWith('.tmp') ||
                filename.endsWith('.crdownload') ||
                filename.endsWith('.part') ||
                filename.endsWith('.download') ||
                filename.startsWith('~') ||
                filename.startsWith('.') ||
                filename.startsWith('~$') ||
                filename.endsWith('.lock')) {
                return;
            }
            removeLog(filename);
        } catch (error) {
            console.log("Error occurred while removing log");
            console.log(error);
        }
    });

    console.log(`Watchman has started watching the directory ${data.path}`);
}

module.exports = { watchMan };
