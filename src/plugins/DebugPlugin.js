const fs = require('fs-extra');
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

        compiler.hooks.modulerizr_finished.tapPromise('DebugPlugin-CreateDebugFile', async(modulerizr) => {
            return await fs.writeFile(path.join(modulerizr.config.dest, 'modulerizr-debug.config.json'), JSON.stringify({ config: modulerizr.config, store: modulerizr.store.queryOne('$') }, null, 1));
        });
    }
}

exports.DebugPlugin = DebugPlugin;