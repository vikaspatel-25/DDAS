const fs = require('fs-extra');
const path = require('path');
const {generateFileHash} = require("../services/hashGenerator")

const logFile = path.join(__dirname,'../log.json')
const { json } = require('stream/consumers');

function normalizeFilename(filename) {
  // Replace the pattern "(number)" followed by the file extension with just the extension
  return filename.replace(/\s*\(\d+\)\.\w+$/, (match) => {
      // Use the file extension without the appended number and remove any leading spaces
      return '.' + match.trim().split('.').pop();
  }).trim(); // Ensure no trailing spaces remain after the replacement
}


function logMetaData(filePath){
   const stats = fs.statSync(filePath);
   const hash = generateFileHash(filePath);
   const metadata = {
    filename: path.basename(filePath),
    trimmedFilename: normalizeFilename(path.basename(filePath)),
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