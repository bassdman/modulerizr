const { writeFiles } = require("./lib/writeFiles");
const { globFiles } = require("./lib/globFiles");
const foreachPromise = require('./lib/foreachPromise');
const { Modulerizr } = require('./lib/Modulerizr');

async function modulerizr(_config) {
    const defaultConfig = require('../modulerizr.default.config.js');
    const config = Object.assign(defaultConfig, _config);
    const modulerizr = new Modulerizr(config);

    await saveInStore(modulerizr, 'src');
    await saveInStore(modulerizr, 'components');

    await executeFilePlugins('initial', modulerizr);
    await executeFilePlugins('component', modulerizr, 'components');
    await executeFilePlugins('src', modulerizr, 'src');

    await executeFilePlugins('beforeRender', modulerizr, null, 'default');
    await writeFiles(modulerizr, config.dest);

    return await executeFilePlugins('afterRender', modulerizr);
}

async function executeFilePlugins(pluginType, modulerizr, dataType = null, _default = false) {
    const systemPlugins = modulerizr.config._plugins.filter(plugin => plugin.pluginType == pluginType);
    const publicPlugins = (modulerizr.config.plugins || []).filter(plugin => plugin.pluginType == pluginType || (_default && plugin.pluginType == null));
    const allPlugins = systemPlugins.concat(publicPlugins);

    modulerizr.log(`start ${pluginType}-plugins `)

    await foreachPromise(allPlugins, async plugin => {
        modulerizr.log(`   execute ${pluginType}-plugin "${plugin.name}". `);

        if (pluginType != 'src' && pluginType != 'component') {
            return Promise.resolve(plugin(modulerizr))
        } else {
            const files = modulerizr.get(dataType);
            await foreachPromise(Object.values(files), async currentFile => {
                const pluginResult = plugin(modulerizr, currentFile);

                if (pluginResult == null)
                    return null;
                else if (pluginResult.then !== null) {
                    const promisedPluginResult = await pluginResult;
                    modulerizr.set(dataType, currentFile.key, promisedPluginResult);
                } else
                    modulerizr.set(dataType, currentFile.key, pluginResult);

                return pluginResult;
            });
        }
        return;
    });

    modulerizr.log(`finished ${pluginType}-plugins \n----------`);

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
}

function prepareConfigEntry(src) {
    if (src == undefined)
        throw new Error('modulerizr.config.src: src is undefined but required.');
    if (Array.isArray(src))
        return src;
    return [src];
}

module.exports = modulerizr;