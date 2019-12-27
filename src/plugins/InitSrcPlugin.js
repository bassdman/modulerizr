const fs = require('fs-extra');
const crypto = require('crypto');

const { ensureArray, globFiles, foreachPromise } = require('../utils');

class InitSrcPlugin {
    constructor(pluginconfig = {}) {
        this.internal = true;
    }
    async apply(compiler) {

        compiler.hooks.modulerizr_init.tapPromise('InitSrcPlugin', async(modulerizr) => {
            if (modulerizr.config.src == undefined)
                throw new Error('Error in your modulerizr.config: "src" is undefined but required.');

            const srcFiles = await globFiles(ensureArray(modulerizr.config.src), modulerizr.config._rootPath);
            logFoundFiles(srcFiles, modulerizr);

            return await foreachPromise(srcFiles, async filePath => {
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
            });
        })
    }
}

function logFoundFiles(fileNames, modulerizr) {
    if (fileNames.length == 0) {
        modulerizr.log(`Sorry, no src-files found. Modify the attribute "src" in your modulerizr config to match some files.`, 'error');
    } else {
        modulerizr.log(`Found the following src-files:`);
        fileNames.forEach(file => modulerizr.log(`   - ${file}`));
    }
}

exports.InitSrcPlugin = InitSrcPlugin;