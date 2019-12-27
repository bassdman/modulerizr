const path = require('path');

class DebugPlugin {
    constructor(pluginconfig = {}) {
        this.internal = true;
        this.config = pluginconfig;
    }
    async apply(compiler) {
        if (this.config.apply)
            this.config.apply(modulerizr);

        if (this.config.createDebugFile === false)
            return;

        compiler.hooks.emitModulerizr.tap('DebugPlugin-CreateDebugFile', async(compilation, modulerizr) => {
            const content = JSON.stringify({ config: modulerizr.config, store: modulerizr.store.queryOne('$') }, null, 1);
            compilation.assets['modulerizr-debug.config.json'] = {
                source() {
                    return content;
                },
                size: content.length
            }
        });
    }
}

exports.DebugPlugin = DebugPlugin;