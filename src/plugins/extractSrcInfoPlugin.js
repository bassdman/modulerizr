const fs = require('fs-extra');

async function extractSrcInfoPlugin(modulerizr, currentFile) {
    const content = await fs.readFile(currentFile.key, "UTF-8")

    const retObj = Object.assign({
        content,
        original: content,
        path: currentFile.key
    }, currentFile);


    return retObj;
}
extractSrcInfoPlugin.metadata = {
    pluginType: "src",
    name: 'Internal-ExtractSrcInfoPlugin'
}

exports.extractSrcInfoPlugin = extractSrcInfoPlugin;