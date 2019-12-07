const { writeFiles } = require("./lib/writeFiles");
const { globFiles } = require("./lib/globFiles");
const foreachPromise = require('./lib/foreachPromise');
const { Store } = require('./lib/Modulerizr');

async function modulerizr(_config) {
    const defaultConfig = require('../modulerizr.default.config.js');
    const config = Object.assign(defaultConfig, _config);
    const fileStore = new Store();

    await saveInStore('src', fileStore, config);
    await saveInStore('components', fileStore, config);
    await applyFilePlugins('beforePlugin', fileStore, null, config);
    await applyFilePlugins('componentPlugin', fileStore, 'components', config);
    await applyFilePlugins('srcPlugin', fileStore, 'src', config);
    await applyFilePlugins('plugin', fileStore, null, config);

    await writeFiles(fileStore, config.dest);

    return await applyFilePlugins('afterPlugin', fileStore, null, config);
}

async function applyFilePlugins(name, fileStore, type, config) {
    const systemPlugins = config[`_${name}s`] || [];
    const publicPlugins = config[`${name}s`] || [];
    const allPlugins = systemPlugins.concat(publicPlugins);

    if (config.log)
        console.log(`start ${name}s `);

    await foreachPromise(allPlugins, async plugin => {
        if (config.log)
            console.log(`   execute ${name} "${plugin.name}". `);

        if (type == null) {
            return Promise.resolve(plugin(fileStore, config))
        } else {
            const files = fileStore.get(type);
            await foreachPromise(Object.values(files), async currentFile => {
                const pluginResult = plugin(currentFile, fileStore, config);

                if (pluginResult == null)
                    return null;
                else if (pluginResult.then !== null) {
                    const promisedPluginResult = await pluginResult;
                    fileStore.set(type, currentFile.key, promisedPluginResult);
                } else
                    fileStore.set(type, currentFile.key, pluginResult);

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