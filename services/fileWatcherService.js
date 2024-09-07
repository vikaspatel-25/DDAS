const path = require('path');
const chokidar = require('chokidar');
const { checkDuplicate, removeLog } = require("./duplicateDetection");
const { logMetaData } = require("../middleware/logger");
const { generateFileHash } = require('./hashGenerator');
const { checkOwner } = require("./checkOwner");

async function watchMan(data, socket) {
    // Seting up  watcher
    const watcher = chokidar.watch(data.path, {
        ignored: [
            /(^|[\/\\])\../, // Hidden files and directories
            /\.tmp$/, /\.crdownload$/, /\.part$/, /\.download$/, /\.swp$/, /\.swo$/, /\.bak$/, /\.old$/, /\.log$/, // Temporary files
            /^~$/, // Temporary files with tilde
            /(^|[\/\\])(Program Files|Program Files \(x86\)|Windows|System32|AppData|Local Settings|Temp|System Volume Information|Documents and Settings)/i, // System directories
        ],
        persistent: true,
        ignoreInitial: true,
    });

    // Watcher events
    watcher.on('add', async (filePath) => {
        const filename = path.basename(filePath);
        try {
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

            const hash = await generateFileHash(filePath);
            if (checkDuplicate(hash)) {
                const ownerMatches = await checkOwner(filePath, data.username);
                socket.emit('ownerCheck', { filePath, matched: ownerMatches });
            } else {
                logMetaData(filePath,hash);
                console.log(`Logged file: ${filename}`);
            }
        } catch (error) {
            console.log("Error handling added file:", error);
        }
    });

    watcher.on('unlink', (fileData) => {
        try {
            const filename = path.basename(fileData);
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
            console.log("Error occurred while removing log:", error);
        }
    });

    watcher.on('rename', async (oldPath, newPath) => {
        try {
            const oldFilename = path.basename(oldPath);
            const newFilename = path.basename(newPath);
    
            if (fileMap.has(oldFilename)) {
                console.log(`File renamed from ${oldFilename} to ${newFilename}`);
                fileMap.delete(oldFilename);
                fileMap.set(newFilename, newPath);
    
                const hash = await generateFileHash(newPath);
                console.log(`File renamed and hash recalculated: ${newFilename}, Hash: ${hash}`);
    
                if (checkDuplicate(hash)) {
                    const ownerMatches = await checkOwner(newPath, data.username);
                    socket.emit('ownerCheck', { filePath: newPath, matched: ownerMatches });
                } else {
                    logMetaData(newPath, hash);
                    console.log(`Logged renamed file: ${newFilename}`);
                }
            }
        } catch (error) {
            console.log("Error handling renamed file:", error);
        }
    });
    

    // Handle errors from the watcher
    watcher.on('error', (error) => {
        if (error.code === 'EPERM') {
            console.log("Permission error, ignoring file:", error.path);
        } else {
            console.log("Watcher error:", error);
        }
    });

    console.log(`Watchman has started watching the directory ${data.path}`);
}

module.exports = { watchMan };
