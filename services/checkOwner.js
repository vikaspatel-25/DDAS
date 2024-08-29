const { exec } = require("child_process");
const { promisify } = require("util");

const execPromise = promisify(exec);

async function checkOwner(filePath, username) {
    try {
        const { stdout, stderr } = await execPromise(`powershell -Command "(Get-Acl '${filePath}').Owner"`);
        
        if (stderr) {
            console.log("Error running cmd:", stderr);
            return false;
        }

        if (stdout) {
            username = username.replace(/\//g, '\\').trim().toLowerCase();
            const owner = stdout.replace(/\//g, '\\').trim().toLowerCase();
            
            return owner === username;
        }

        return false;
    } catch (error) {
        console.log("Error checking file owner:", error);
        return false;
    }
}

module.exports = {
    checkOwner
};
