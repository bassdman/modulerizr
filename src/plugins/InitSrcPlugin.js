const fs = require('fs-extra');

async function InitSrcPlugin(modulerizr, currentFile) {
    const content = await fs.readFile(currentFile.key, "UTF-8")

    const retObj = Object.assign({
        content,
        original: content,
        path: currentFile.key
    }, currentFile);


    return retObj;
}
InitSrcPlugin.metadata = {
    pluginType: "src",
    name: 'Internal-InitSrcPlugin'
}

exports.InitSrcPlugin = InitSrcPlugin;