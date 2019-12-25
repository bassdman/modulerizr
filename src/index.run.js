const { foreachPromise } = require('./utils');
const { Modulerizr } = require('./Modulerizr');
const color = require('colors');

async function run(_config) {
    let config = _config;

    if (!Array.isArray(config))
        config = [config];

    await foreachPromise(config, conf => runOne(conf));

    console.log(color.blue('Modulerizr finished.'));
}

async function runOne(_config) {
    const defaultConfig = require('../modulerizr.default.config.js');
    const config = Object.assign(defaultConfig, _config);
    config.plugins = (config._plugins).concat(config.plugins || []);
    const modulerizr = new Modulerizr(config);

    modulerizr.log(`\nThe rootPath is: ${config._rootPath}`);

    await initializePlugins(modulerizr);

    await modulerizr.plugins.emit('init');
    await modulerizr.plugins.emit('ready');
    await modulerizr.plugins.emit('render');
    await modulerizr.plugins.emit('afterRender');
    await modulerizr.plugins.emit('finish');
}

async function initializePlugins(modulerizr) {
    const plugins = modulerizr.config.plugins;

    await foreachPromise(plugins, async plugin => {
        modulerizr.store.value('$.plugins._current', plugin);

        return Promise.resolve(plugin.apply(modulerizr))
    });

    modulerizr.log('');
    return;
}

exports.run = run;