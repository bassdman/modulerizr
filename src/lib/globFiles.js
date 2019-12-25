const glob = require('glob');
const { foreachPromise } = require('./utils');

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
        })
        .then((_files) => {
            if (_files.length == 1 && files[0] == '')
                return [];

            // schaut komisch aus, löst aber die Arrays in mehreren Hierarchien auf.
            return files.join(',').split(',');
        });
}
exports.globFiles = globFiles;