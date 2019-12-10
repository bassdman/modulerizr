const { globFiles } = require("./lib/globFiles");
const foreachPromise = require('./lib/foreachPromise');
const { Modulerizr } = require('./lib/Modulerizr');

async function modulerizr(_config) {
    const defaultConfig = require('../modulerizr.default.config.js');
    const config = Object.assign(defaultConfig, _config);
    const modulerizr = new Modulerizr(config);

    await saveInStore(modulerizr, 'src');
    await saveInStore(modulerizr, 'components');

    modulerizr.log(`\nThe rootPath is: ${config._rootPath}`);

    modulerizr.log(`\nApplyPlugins:`);

    await executeFilePlugins('initial', modulerizr);
    await executeFilePlugins('component', modulerizr, 'components');
    await executeFilePlugins('src', modulerizr, 'src');

    await executeFilePlugins('beforeRender', modulerizr, null, 'default');



    return await executeFilePlugins('afterRender', modulerizr);
}

async function executeFilePlugins(pluginType, modulerizr, dataType = null, _default = false) {
    const systemPlugins = getPlugins(modulerizr.config._plugins, pluginType, _default);
    const publicPlugins = getPlugins(modulerizr.config.plugins, pluginType, _default);
    const allPlugins = systemPlugins.concat(publicPlugins);

    if (allPlugins.length == 0 && pluginType != 'render')
        modulerizr.log(`No ${pluginType}-plugins found.`)

    await foreachPromise(allPlugins, async plugin => {
        const pluginMetadata = plugin.metadata || {};
        const internalText = pluginMetadata.internal ? "(Internal)" : ""
        modulerizr.log(`   execute ${pluginType}-plugin "${pluginMetadata.name || plugin.name}" ${internalText}.`, 'green');

        if (pluginType != 'src' && pluginType != 'component') {
            return Promise.resolve(plugin(modulerizr))
        } else {
            const files = modulerizr.get(dataType);
            await foreachPromise(Object.values(files), async currentFile => {
                const pluginResult = plugin(modulerizr, currentFile);

                if (pluginResult == null) {
                    return null;
                } else if (pluginResult.then !== null) {
                    const promisedPluginResult = await pluginResult;
                    modulerizr.set(dataType, currentFile.key, promisedPluginResult);
                } else {
                    modulerizr.set(dataType, currentFile.key, pluginResult);
                }
                return pluginResult;
            });
        }
        return;
    });

    return;
}

async function saveInStore(modulerizr, type) {
    const config = modulerizr.config;
    const fileNames = await globFiles(prepareConfigEntry(config[type], type), config._rootPath);
    fileNames.forEach(file => {
        modulerizr.set(type, file, {
            key: file
        });
    })
    if (fileNames.length == 0) {
        modulerizr.log(`Sorry, no ${type}-files found. Modify the entry "${type}" in your modulerizr config to match some files.`, 'red');
    } else {
        modulerizr.log(`\nFound the following ${type}-files:`, 'green');
        fileNames.forEach(file => console.log(`   - ${file}`));
    }

}

function prepareConfigEntry(src, type) {
    if (src == undefined)
        throw new Error('Error in your modulerizr.config: ' + type + ' is undefined but required.', 'red');
    if (Array.isArray(src))
        return src;
    return [src];
}

function getPlugins(plugins = [], pluginType, _default) {
    return plugins.filter(plugin => {
        const currentPluginType = plugin.metadata ? plugin.metadata.pluginType : null;

        if (Array.isArray(currentPluginType)) {
            return currentPluginType.includes(pluginType) || (_default && currentPluginType == null);
        } else
            return pluginType == currentPluginType || (_default && currentPluginType == null);
    });
}

module.exports = modulerizr;