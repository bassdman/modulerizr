const fs = require('fs-extra');

async function extractSrcInfoPlugin(modulerizr, currentFile) {
    const content = await fs.readFile(currentFile.key, "UTF-8")

    const retObj = Object.assign({
        content,
        raw: content,
        path: currentFile.key
    }, currentFile);


    return retObj;
}
extractSrcInfoPlugin.pluginType = "src";

exports.extractSrcInfoPlugin = extractSrcInfoPlugin;