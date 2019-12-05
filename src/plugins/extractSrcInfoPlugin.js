const fs = require('fs-extra');

async function extractSrcInfoPlugin(currentFile, fileStore, config) {
    const content = await fs.readFile(currentFile.key, "UTF-8")

    const retObj = Object.assign({
        content,
        original: content,
        path: currentFile.key
    }, currentFile);


    return retObj;
}

exports.extractSrcInfoPlugin = extractSrcInfoPlugin;