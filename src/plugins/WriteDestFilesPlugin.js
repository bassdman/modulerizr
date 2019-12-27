const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
class WriteDestFilesPlugin {
    constructor(pluginconfig = {}) {
        this.internal = true;
    }
    async apply(compiler) {

        compiler.hooks.initModulerizr.tap('WriteDestFilesPlugin', async(modulerizr) => {
            new CleanWebpackPlugin().apply(compiler);
        });

        compiler.hooks.finishedModulerizr.tap('WriteDestFilesPlugin', async(compilation, modulerizr) => {


            modulerizr.store.each('$.src.*', async(currentFile, currentPath, i) => {
                    /*      compilation.assets[currentFile.path] = {
                                  source() {
                                      return currentFile.content
                                  },
                                  size: currentFile.content.length
                              }*/
                    const filepath = path.join(modulerizr.config._rootPath, currentFile.path)
                    console.log(filepath)
                    const srcOptions = Object.assign({}, modulerizr.config.srcOptions || {}, {
                        template: filepath,
                        //  filename: path.basename(currentFile.path)
                    });

                    HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                        'WriteDestFilesPlugin', // <-- Set a meaningful name here for stacktraces
                        (data, cb) => {
                            // Manipulate the content
                            console.log('do transformation')
                            data.html += currentFile.content;
                            // Tell webpack to move on
                            cb(null, data)
                        }
                    )

                    new HtmlWebpackPlugin(srcOptions).apply(compiler);
                })
                /*      compilation.assets[filename] = {
                          source() {
                              return pretty(currentFile.content)
                          },
                          size: currentFile.content.length
                      }*/
        })

    }
}

function removeLeadSubfoldersFromPath(configSrc, fileSrc) {
    const cleanedConfigSrcPath = path.dirname(fileSrc.replace(/\*/g, '').replace(/\//g, '/'))
    return fileSrc.replace(cleanedConfigSrcPath, "");
}

exports.WriteDestFilesPlugin = WriteDestFilesPlugin;