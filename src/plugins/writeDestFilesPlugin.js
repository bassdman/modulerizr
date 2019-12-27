const path = require('path');
const pretty = require('pretty');

class WriteDestFilesPlugin {
    constructor(pluginconfig = {}) {
        this.internal = true;
    }
    async apply(compiler) {
        compiler.hooks.emitModulerizr.tap('WriteDestFilesPlugin', async(compilation, modulerizr) => {
            modulerizr.store.each('$.src.*', async(currentFile, currentPath, i) => {
                const filename = path.basename(currentFile.path)

                compilation.assets[filename] = {
                    source() {
                        return pretty(currentFile.content)
                    },
                    size: currentFile.content.length
                }
            });
        })

    }
}

function removeLeadSubfoldersFromPath(configSrc, fileSrc) {
    const cleanedConfigSrcPath = path.dirname(fileSrc.replace(/\*/g, '').replace(/\//g, '/'))
    return fileSrc.replace(cleanedConfigSrcPath, "");
}

exports.WriteDestFilesPlugin = WriteDestFilesPlugin;