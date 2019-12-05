const { prepareConfigEntry } = require("./lib/prepareConfigEntry");
const { writeFiles } = require("./lib/writeFiles");
const { globFiles } = require("./lib/globFiles");
const foreachPromise = require('./lib/foreachPromise');
const { Store } = require('./lib/fileStore');
const { extractComponentInfoPlugin } = require("./plugins/extractComponentInfoPlugin");

async function modulerizr(_config) {
    const defaultConfig = require('../modulerizr.default.config.js');
    const config = Object.assign(defaultConfig, _config);

    const srcFileNames = await globFiles(prepareConfigEntry(config.src), config._rootPath);
    const componentFileNames = await globFiles(prepareConfigEntry(config.components), config._rootPath);

    const fileStore = new Store();

    saveInStore(fileStore, 'src', srcFileNames);
    saveInStore(fileStore, 'components', componentFileNames);

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
            console.log(files)
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

function saveInStore(fileStore, type, fileNames) {
    fileNames.forEach(file => {
        fileStore.set(type, file, {
            key: file
        });
    })
}
module.exports = modulerizr;