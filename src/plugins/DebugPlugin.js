const fs = require('fs-extra');
const path = require('path');

class DebugPlugin {
    constructor(pluginconfig = {}) {
        this.pluginType = "initial";
        this.name = 'Modulerizr-DebugPlugin';
        this.internal = true;
        this.config = pluginconfig;
    }
    async apply(modulerizr) {
        modulerizr.config.plugins.push(new createDebugFilePlugin());

        if (!this.config.ignorePlugins) {
            console.log('No Plugins are ignored (use debugPlugin({ignorePlugins:["Name-ofPlugin"]}) to ignore Plugins)');
        }
        if (this.config.ignorePlugins) {
            let ignorePlugins = this.config.ignorePlugins;
            if (!Array.isArray(ignorePlugins))
                ignorePlugins = [ignorePlugins];

            modulerizr.config.plugins = modulerizr.config.plugins.map(plugin => {
                if (ignorePlugins.includes(plugin.name)) {
                    plugin.ignore = true;
                    plugin.log = 'Plugin "#name" won\'t be executed - it is ignored by the DebugPlugin.';
                    plugin.logColor = "red";
                }
                return plugin;
            })
        }
    }
}

class createDebugFilePlugin {
    constructor(pluginconfig = {}) {
        this.pluginType = "afterRender";
        this.name = 'Modulerizr-CreateDebugFilePlugin';
        this.internal = true;
    }
    async apply(modulerizr) {
        return await fs.writeFile(path.join(modulerizr.config.dest, 'modulerizr-debug.config.json'), JSON.stringify({ config: modulerizr.config, store: modulerizr.store.queryOne('$') }, null, 1));
    }
}

exports.DebugPlugin = DebugPlugin;