const fs = require('fs-extra');
const path = require('path');

const logFile = path.join(__dirname,'../log.json')


function checkDuplicate(hash){
    if(!fs.existsSync(logFile)){
       return false;
    }
    const logFileData = JSON.parse(fs.readFileSync(logFile));
    return logFileData.some((element) =>{ return element.hash == hash});
}

module.exports = {checkDuplicate}