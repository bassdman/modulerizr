const fs = require('fs-extra');
const path = require('path');

class DebugPlugin {
    constructor(pluginconfig = {}) {
        this.internal = true;
        this.config = pluginconfig;
    }
    async apply(modulerizr) {
        modulerizr.plugins.on('deploy', async() => {
            return await fs.writeFile(path.join(modulerizr.config.dest, 'modulerizr-debug.config.json'), JSON.stringify({ config: modulerizr.config, store: modulerizr.store.queryOne('$') }, null, 1));
        });
    }
}

exports.DebugPlugin = DebugPlugin;