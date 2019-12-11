const fs = require('fs-extra');
const crypto = require('crypto');

async function InitSrcPlugin(modulerizr, currentFile) {
    const content = await fs.readFile(currentFile.key, "UTF-8")

    const retObj = Object.assign({
        content,
        original: content,
        path: currentFile.key,
        id: crypto.createHash('md5').update(content).digest("hex").substring(0, 8)
    }, currentFile);

    return retObj;
}
InitSrcPlugin.metadata = {
    pluginType: "src",
    name: 'Modulerizr-InitSrcPlugin',
    internal: true
}

exports.InitSrcPlugin = InitSrcPlugin;