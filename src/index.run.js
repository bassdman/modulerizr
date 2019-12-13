const { globFiles } = require("./lib/globFiles");
const foreachPromise = require('./lib/foreachPromise');
const { Modulerizr } = require('./lib/Modulerizr');

function run(_config) {
    const configAsArray = Array.isArray(_config) ? _config : [_config];

    return foreachPromise(configAsArray, conf => runOne(conf))
}

async function runOne(_config) {
    const defaultConfig = require('../modulerizr.default.config.js');
    const config = Object.assign(defaultConfig, _config);
    config.plugins = (config._plugins).concat(config.plugins || []);
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
    const plugins = getPlugins(modulerizr.config.plugins, pluginType, _default);

    if (plugins.length == 0 && pluginType != 'render')
        modulerizr.log(`No ${pluginType}-plugins found.`)

    await foreachPromise(plugins, async plugin => {
        const pluginMetadata = plugin.metadata || {};
        const internalText = pluginMetadata.internal ? "(Internal)" : "";

        if (pluginMetadata.log) {
            modulerizr.log(pluginMetadata.log.replace("#name", pluginMetadata.name), pluginMetadata.logColor);
        }
        if (pluginMetadata.ignore) {
            return;
        }
        if (plugin.metadata)
            modulerizr.log(`execute ${pluginType}-plugin "${pluginMetadata.name || plugin.name}" ${internalText}.`, 'green');

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



exports.run = run;