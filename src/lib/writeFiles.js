const foreachPromise = require('./foreachPromise');
const path = require('path');
const fs = require('fs-extra');

function writeFiles(destpath, files) {
    return foreachPromise(Object.keys(files), file => {
        return fs.ensureDir(destpath)
            .then(fs.writeFile(path.join(destpath, file), files[file]));
    });
}
exports.writeFiles = writeFiles;