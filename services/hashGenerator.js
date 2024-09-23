const crypto = require('crypto');
const fs = require('fs-extra');

async function generateFileHash(filePath, retryCount = 500, delay = 500) {

    return new Promise((resolve, reject) => {
        const hashSum = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        
        stream.on('data', (chunk) => {
            hashSum.update(chunk); 
        });

        stream.on('end', () => {
            const hash = `${hashSum.digest('hex')}` 
           resolve(hash); 
        });

        stream.on('error', (err) => {
            if (err.code === 'EBUSY' && retryCount > 0) {
                console.log(`File is busy, retrying in ${delay}ms... (Remaining retries: ${retryCount})`);
                setTimeout(async () => {
                    try {
                        const hash = await generateFileHash(filePath, retryCount - 1, delay);
                        resolve(hash);
                    } catch (retryError) {
                        reject(retryError);
                    }
                }, delay);
            } else {
                reject(err);
            }
        });
    });
}

module.exports = { generateFileHash };
