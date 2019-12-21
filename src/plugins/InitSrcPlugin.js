const fs = require('fs-extra');
const crypto = require('crypto');

const { globFiles } = require("../lib/globFiles");
const { ensureArray } = require('../lib/utils');
const foreachPromise = require('../lib/foreachPromise');

async function InitSrcPlugin(modulerizr) {

    if (modulerizr.config.src == undefined)
        throw new Error('Error in your modulerizr.config: "src" is undefined but required.', 'red');

    const srcFiles = await globFiles(ensureArray(modulerizr.config.src), modulerizr.config._rootPath);
    logFoundFiles(srcFiles, modulerizr);

    return foreachPromise(srcFiles, async filePath => {
        const content = await fs.readFile(filePath, "UTF-8")

        const retObj = {
            content,
            original: content,
            path: filePath,
            key: filePath,
            id: crypto.createHash('md5').update(content).digest("hex").substring(0, 8)
        };

        modulerizr.store.value(`$.src.id_${retObj.id}`, retObj);
        return retObj;
    })
}
InitSrcPlugin.metadata = {
    pluginType: "initial",
    name: 'Modulerizr-InitSrcPlugin',
    internal: true
}

function logFoundFiles(fileNames, modulerizr) {
    if (fileNames.length == 0) {
        modulerizr.log(`Sorry, no src-files found. Modify the attribute "src" in your modulerizr config to match some files.`, 'red');
    } else {
        modulerizr.log(`Found the following src-files:`, 'green');
        fileNames.forEach(file => modulerizr.log(`   - ${file}`));
    }
}

exports.InitSrcPlugin = InitSrcPlugin;