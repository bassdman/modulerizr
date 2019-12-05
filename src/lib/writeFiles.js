const foreachPromise = require('./foreachPromise');
const path = require('path');
const fs = require('fs-extra');

function writeFiles(fileStore, destpath) {
    const files = fileStore.get('src');

    return foreachPromise(Object.keys(files), file => {
        console.log(files[file])
        return fs.ensureDir(destpath)
            .then(fs.writeFile(path.join(destpath, file), files[file].content));
    });
}
exports.writeFiles = writeFiles;