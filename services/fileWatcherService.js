const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const {checkDuplicate} = require("./duplicateDetection");
const {logMetaData} = require("../middleware/logger");
const { generateFileHash } = require('../middleware/hashGenerator');

//defining the downloads directory
const downloadsDir = path.join(os.homedir(),'Downloads');

function watchMan(){
//setup watcher
const watcher = chokidar.watch(downloadsDir,{
    persistent:true,
    ignoreInitial:true,
});

//watcher events
watcher.on('add',(filePath)=>{
    //filepath will be automatically send as prop by chokidar library containing details about file.

    const filename = path.basename(filePath);
    try {
        //ignoring temp files created at download process
        if ( filename.endsWith('.tmp') || 
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
    if(checkDuplicate(hash)){
        console.log(`Duplicate file detected ${filename}`)
        // we can delete file if we want using fs.unlink(filepath)
        setTimeout(()=>{fs.unlink(filePath); },500)
             
    } 
    else{
         logMetaData(filePath);
         console.log(`index.js- logged file: ${filename}`)
    }
    }
    catch (error) {
        console.log("Something went wrong")
        console.log(error);
    }

})
console.log(`Watchman has started watching the directory ${downloadsDir}`)
};

module.exports = {watchMan,downloadsDir};