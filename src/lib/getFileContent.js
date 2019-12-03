const foreachPromise = require("./foreachPromise");
const fs = require('fs-extra');

function getFileContent(_files, config = {}) {
    let files = {};
    return foreachPromise(_files, filepath => {
            return fs.readFile(filepath, "UTF-8")
                .then(content => {
                    if (_files.length == 1 && config.mode !== 'object')
                        files = content;
                    else
                        files[filepath] = { content: content };
                });
        })
        .then(() => {
            return files;
        });
}
exports.getFileContent = getFileContent;