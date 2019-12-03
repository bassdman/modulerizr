const glob = require('glob');
const foreachPromise = require('./foreachpromise');

function globFiles(src, rootPath) {
    const files = [];
    return foreachPromise(src, srcEntry => {
            return new Promise((resolve, reject) => {
                    glob(srcEntry, { root: rootPath }, (err, result) => {
                        resolve(result);
                    });
                })
                .then(filesGlob => files.push(filesGlob));
        })
        .then(() => {
            // schaut komisch aus, löst aber die Arrays in mehreren Hierarchien auf.
            return files.join(',').split(',');
        });
}
exports.globFiles = globFiles;