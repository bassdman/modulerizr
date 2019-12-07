const foreachPromise = require('./foreachPromise');
const path = require('path');
const fs = require('fs-extra');

async function writeFiles(fileStore, destpath) {
    const files = fileStore.get('src');

    return foreachPromise(Object.keys(files), async file => {
        const filePath = path.join(destpath, file);
        const fileContent = files[file].content;

        await fs.ensureDir(destpath);
        return await fs.writeFile(filePath, fileContent);
    });
}
exports.writeFiles = writeFiles;