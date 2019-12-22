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

    await initializePlugins(modulerizr);

    await modulerizr.plugins.emit('init');
    await modulerizr.plugins.emit('ready');
    await modulerizr.plugins.emit('render');
    await modulerizr.plugins.emit('afterRender');
    await modulerizr.plugins.emit('deploy');
}

async function initializePlugins(modulerizr) {
    const plugins = getPlugins(modulerizr.config.plugins, null);

    if (plugins.length == 0)
        modulerizr.log(`No ${pluginType}-plugins found.`)

    await foreachPromise(plugins, async plugin => {
        const internalText = plugin.internal ? "(Internal)" : "";

        if (plugin.ignore) {
            return;
        }
        modulerizr.log(`Initialize plugin "${plugin.name}" ${internalText}.`, 'green');

        return Promise.resolve(plugin.apply(modulerizr))
    });

    return;
}

async function executeFilePlugins(pluginType, modulerizr, dataType = null) {
    const plugins = getPlugins(modulerizr.config.plugins, pluginType);

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
        return pluginType == plugin.pluginType;
    });
}

exports.run = run;