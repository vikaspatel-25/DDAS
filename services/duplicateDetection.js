const fs = require('fs-extra');
const path = require('path');

const logFile = path.join(__dirname,'../log.json')

// function to check duplicate files
function checkDuplicate(hash){
    if(!fs.existsSync(logFile)){
       return false;
    }
    const logFileData = JSON.parse(fs.readFileSync(logFile));
    return logFileData.find((element) =>{ return element.hash == hash});
}

//function to remove log
function removeLog(filename){
    try {
        if(!fs.existsSync(logFile)){
            return;
        }
    const logFileData = JSON.parse(fs.readFileSync(logFile));
    const updatedLogData =  logFileData.filter((element)=>{ return element.filename != filename})
    fs.writeFileSync(logFile,JSON.stringify(updatedLogData,null,4))
    console.log("Log entry removed",filename);
   
} catch (error) {
        console.log("error removing log",error);
    }

}
module.exports = {checkDuplicate,removeLog}