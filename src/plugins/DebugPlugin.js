const fs = require('fs-extra');
const crypto = require('crypto');
const path = require('path');

function DebugPlugin(config) {
    function debugplugin(modulerizr) {
        modulerizr.config.plugins.push(createDebugFilePlugin);

        if (!config.ignorePlugins) {
            console.log('No Plugins are ignored (use debugPlugin({ignorePlugins:["Name-ofPlugin"]}) to ignore Plugins)');
        }
        if (config.ignorePlugins) {
            let ignorePlugins = config.ignorePlugins;
            if (!Array.isArray(ignorePlugins))
                ignorePlugins = [ignorePlugins];

            modulerizr.config.plugins = modulerizr.config.plugins.map(plugin => {
                if (!plugin.metadata)
                    return plugin;

                if (ignorePlugins.includes(plugin.metadata.name)) {
                    plugin.metadata.ignore = true;
                    plugin.metadata.log = 'Plugin "#name" won\'t be executed - it is ignored by the DebugPlugin.';
                    plugin.metadata.logColor = "red";
                }
                return plugin;
            })
        }
    }
    debugplugin.metadata = {
        pluginType: "initial",
        name: 'Modulerizr-DebugPlugin',
        internal: true
    }


    return debugplugin;
}


async function createDebugFilePlugin(modulerizr) {
    await fs.writeFile(path.join(modulerizr.config.dest, 'modulerizr-debug.config.json'), JSON.stringify({ src: modulerizr.get('src'), components: modulerizr.get('components'), embeddedComponents: modulerizr.get('embeddedComponents'), config: modulerizr.config }, null, 1));
}
createDebugFilePlugin.metadata = {
    pluginType: "afterRender",
    name: 'Modulerizr-CreateDebugFilePlugin',
    internal: true
}

exports.DebugPlugin = DebugPlugin;