const path = require('path');
const fs = require('fs-extra');
const pretty = require('pretty');

class WriteDestFilesPlugin {
    constructor(pluginconfig = {}) {
        this.internal = true;
    }
    async apply(compiler) {
        compiler.hooks.doneModulerizr.tapPromise('WriteDestFilesPlugin', async(stats, modulerizr) => {
            /*      const paths = [
                      './samples/sample-01-hello-world/01_helloworld.html',
                      './samples/sample-02-custom-wrapper/02_customWrapper.html'
                  ]
                  webpackconfig.plugins.push(new HtmlReplaceWebpackPlugin([{
                      pattern: '<hello-world></hello-world>',
                      replacement: 'Tag wurde ersetzt'
                  }, ]));

                  paths.forEach(_path => {
                      webpackconfig.plugins.push(new HtmlWebpackPlugin({
                          template: _path,
                          filename: path.basename(_path),
                          mode: 'development',
                          cache: false,
                          hash: true,
                          minify: false
                      }))
                  })*/

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