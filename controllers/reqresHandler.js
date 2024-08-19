require("body-parser");
const fs = require('fs-extra')
const path = require('path');
const logFile = path.join(__dirname,'../log.json')


async function reqHandler(req,res){
 //checking on the basis of name and size
 console.log("Req recieved in handler")
 if(!fs.existsSync(logFile)){
    return res.json({msg:"Record file is missing"});
 }

 const data = req.body;
 const filename = data.filename;
 const fileSize = data.fileSize;
 const logFileData = await JSON.parse(fs.readFileSync(logFile));

 try {
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

    const searchResult = logFileData.find((element) => {
        return element.trimmedFilename === filename && element.size === fileSize;
    });

     if(searchResult){
        console.log("Duplicate file found at:", searchResult.path);
        return res.json({exist:searchResult});
     }
     if(!searchResult){
        return res.json({msg:"No Duplicate files found"});
      }
 } catch (error) {
    console.log("Some error occured while searching in log file\n",error);
    
 }
    
}

module.exports = {reqHandler};