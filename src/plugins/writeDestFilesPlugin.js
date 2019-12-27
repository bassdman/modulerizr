const path = require('path');
const fs = require('fs-extra');
const pretty = require('pretty');

class WriteDestFilesPlugin {
    constructor(pluginconfig = {}) {
        this.internal = true;
    }
    async apply(compiler) {
        compiler.hooks.modulerizr_finished.tapPromise('WriteDestFilesPlugin', async(modulerizr) => {
            const destpath = modulerizr.config.dest;

            modulerizr.store.each('$.src.*', async(currentFile, currentPath, i) => {
                const filePath = path.join(destpath, removeLeadSubfoldersFromPath(modulerizr.config.src, currentFile.path));
                const fileContent = pretty(currentFile.content);

                await fs.ensureDir(destpath);
                return await fs.writeFile(filePath, fileContent);
            });

            return;
        })

    }
}

function removeLeadSubfoldersFromPath(configSrc, fileSrc) {
    const cleanedConfigSrcPath = path.dirname(fileSrc.replace(/\*/g, '').replace(/\//g, '/'))
    return fileSrc.replace(cleanedConfigSrcPath, "");
}

exports.WriteDestFilesPlugin = WriteDestFilesPlugin;