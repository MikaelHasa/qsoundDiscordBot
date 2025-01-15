// Get all files from folders

const fs = require('fs')
const path = require('path')

module.exports = (dir, foldersOnly = false) => {
    let fileNames = [];

    const files = fs.readdirSync(dir, { withFileTypes: true});

    // Loop trough all files 
    for (const file of files) {
        const filePath = path.join(dir, file.name);
        
        // Check if a folder/dir
        if (foldersOnly) {
            if (file.isDirectory()) {
                fileNames.push(filePath);
            }

        } else { // Check if a file (not a folder)
           if (file.isFile()) {
            fileNames.push(filePath);
           }
        }
    }

    return fileNames;
};