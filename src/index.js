const { globFiles } = require("./lib/globFiles");
const foreachPromise = require('./lib/foreachPromise');
const { Modulerizr } = require('./lib/Modulerizr');

async function modulerizr(_config) {
    const defaultConfig = require('../modulerizr.default.config.js');
    const config = Object.assign(defaultConfig, _config);
    const modulerizr = new Modulerizr(config);

    modulerizr.log(`The rootPath is: ${config._rootPath}`);

    await saveInStore(modulerizr, 'src');
    await saveInStore(modulerizr, 'components');

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
        modulerizr.log(`   execute ${pluginType}-plugin "${pluginMetadata.name || plugin.name}". `);

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
    const fileNames = await globFiles(prepareConfigEntry(config[type]), config._rootPath);
    fileNames.forEach(file => {
        modulerizr.set(type, file, {
            key: file
        });
    })
    modulerizr.log(`Found the following ${type}-files: ${fileNames}`);
}

function prepareConfigEntry(src) {
    if (src == undefined)
        throw new Error('modulerizr.config.src: src is undefined but required.');
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