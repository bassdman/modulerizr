const foreachPromise = require('./lib/foreachPromise');
const { Modulerizr } = require('./lib/Modulerizr');
const color = require('colors');

async function run(_config) {
    let config = _config;

    if (!Array.isArray(config))
        config = [config];

    await foreachPromise(config, conf => runOne(conf));

    console.log(color.green('Modulerizr finished.'));
}

async function runOne(_config) {
    const defaultConfig = require('../modulerizr.default.config.js');
    const config = Object.assign(defaultConfig, _config);
    config.plugins = (config._plugins).concat(config.plugins || []);
    const modulerizr = new Modulerizr(config);

    modulerizr.log(`\nThe rootPath is: ${config._rootPath}`);
    modulerizr.log(`\nApplyPlugins:`);

    await executeFilePlugins('initial', modulerizr);
    await executeFilePlugins('beforeRender', modulerizr, null, 'default');
    return await executeFilePlugins('afterRender', modulerizr);
}

async function executeFilePlugins(pluginType, modulerizr, dataType = null, _default = false) {
    const plugins = getPlugins(modulerizr.config.plugins, pluginType, _default);

    if (plugins.length == 0 && pluginType != 'render')
        modulerizr.log(`No ${pluginType}-plugins found.`)

    await foreachPromise(plugins, async plugin => {
        const internalText = plugin.internal ? "(Internal)" : "";

        if (plugin.log) {
            modulerizr.log(plugin.log.replace("#name", plugin.name), plugin.logColor);
        }
        if (plugin.ignore) {
            return;
        }
        modulerizr.log(`execute ${pluginType}-plugin "${plugin.name}" ${internalText}.`, 'green');

        return Promise.resolve(plugin.apply(modulerizr))
    });

    return;
}

function getPlugins(plugins = [], pluginType, _default) {
    return plugins.filter(plugin => {
        const currentPluginType = plugin.pluginType || 'beforeRender';

        if (Array.isArray(currentPluginType)) {
            return currentPluginType.includes(pluginType) || (_default && currentPluginType == null);
        } else
            return pluginType == currentPluginType || (_default && currentPluginType == null);
    });
}

exports.run = run;