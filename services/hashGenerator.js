const crypto = require('crypto');
const fs = require('fs-extra');

function generateFileHash(filePath, retryCount = 5, delay = 500){
    try {
    const fileBuffer =  fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
    } catch (error) {
        if (error.code === 'EBUSY' && retryCount > 0) {
            console.log(`File is busy, retrying in ${delay}ms...`);
            setTimeout(() => {
                return generateFileHash(filePath, retryCount - 1, delay);
            }, delay);
        } else {
            console.error(`Failed to read file after ${5 - retryCount} attempts:`, error);
            throw error; // Rethrow the error if retries fail
        }
    }
    
};

module.exports = {generateFileHash};