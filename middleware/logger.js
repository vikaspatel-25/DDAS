const fs = require('fs-extra');
const path = require('path');
const {generateFileHash} = require("./hashGenerator")

const logFile = path.join(__dirname,'../log.json')
const { json } = require('stream/consumers');


function logMetaData(filePath){
   const stats = fs.statSync(filePath);
   const hash = generateFileHash(filePath);
   const metadata = {
    filename: path.basename(filePath),
    path: filePath,
    size: stats.size,
    hash: hash,
    downloadedAt: new Date().toISOString(),
   }

   let logFileData = [];
   if(fs.existsSync(logFile)){
     logFileData = JSON.parse(fs.readFileSync(logFile));
   }
   logFileData.push(metadata);
   fs.writeFileSync(logFile,JSON.stringify(logFileData,null,4))
}

module.exports = {logMetaData}