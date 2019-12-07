const { writeFiles } = require("./lib/writeFiles");
const { globFiles } = require("./lib/globFiles");
const foreachPromise = require('./lib/foreachPromise');
const { Modulerizr } = require('./lib/Modulerizr');

async function modulerizr(_config) {
    const defaultConfig = require('../modulerizr.default.config.js');
    const config = Object.assign(defaultConfig, _config);
    const modulerizr = new Modulerizr(config);

    await saveInStore('src', modulerizr, config);
    await saveInStore('components', modulerizr, config);
    await applyFilePlugins('beforePlugin', modulerizr, null, config);
    await applyFilePlugins('componentPlugin', modulerizr, 'components', config);
    await applyFilePlugins('srcPlugin', modulerizr, 'src', config);
    await applyFilePlugins('plugin', modulerizr, null, config);

    await writeFiles(modulerizr, config.dest);

    return await applyFilePlugins('afterPlugin', modulerizr, null, config);
}

async function applyFilePlugins(name, modulerizr, type, config) {
    const systemPlugins = config[`_${name}s`] || [];
    const publicPlugins = config[`${name}s`] || [];
    const allPlugins = systemPlugins.concat(publicPlugins);

    if (config.log)
        console.log(`start ${name}s `);

    await foreachPromise(allPlugins, async plugin => {
        if (config.log)
            console.log(`   execute ${name} "${plugin.name}". `);

        if (type == null) {
            return Promise.resolve(plugin(modulerizr))
        } else {
            const files = modulerizr.get(type);
            await foreachPromise(Object.values(files), async currentFile => {
                const pluginResult = plugin(modulerizr, currentFile);

                if (pluginResult == null)
                    return null;
                else if (pluginResult.then !== null) {
                    const promisedPluginResult = await pluginResult;
                    modulerizr.set(type, currentFile.key, promisedPluginResult);
                } else
                    modulerizr.set(type, currentFile.key, pluginResult);

                return pluginResult;
            });
        }
        return;
    });

    if (config.log)
        console.log(`finished ${name}s \n----------`);

    return;
}

async function saveInStore(type, fileStore, config) {
    const fileNames = await globFiles(prepareConfigEntry(config[type]), config._rootPath);
    fileNames.forEach(file => {
        fileStore.set(type, file, {
            key: file
        });
    })
}

function prepareConfigEntry(src) {
    if (src == undefined)
        throw new Error('modulerizr.config.src: src is undefined but required.');
    if (Array.isArray(src))
        return src;
    return [src];
}

module.exports = modulerizr;