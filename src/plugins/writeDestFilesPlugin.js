const foreachPromise = require('../lib/foreachPromise');
const path = require('path');
const fs = require('fs-extra');
const pretty = require('pretty');

async function writeDestFilesPlugin(modulerizr) {
    const files = modulerizr.get('src');
    const destpath = modulerizr.config.dest;

    await foreachPromise(Object.keys(files), async file => {
        const fileconfig = modulerizr.get('src', file);
        const filePath = path.join(destpath, removeLeadSubfoldersFromPath(modulerizr.config.src, file));
        const fileContent = pretty(fileconfig.content);

        await fs.ensureDir(destpath);
        return await fs.writeFile(filePath, fileContent);
    });

    if (modulerizr.config.createDebugFile)
        await fs.writeFile(path.join(destpath, 'modulerizr-debug.config.json'), JSON.stringify({ src: modulerizr.get('src'), components: modulerizr.get('components'), embeddedComponents: modulerizr.get('embeddedComponents'), config: modulerizr.config }, null, 1));

    return;
}

function removeLeadSubfoldersFromPath(configSrc, fileSrc) {
    const cleanedConfigSrcPath = path.dirname(fileSrc.replace(/\*/g, '').replace(/\//g, '/'))
    return fileSrc.replace(cleanedConfigSrcPath, "");
}

writeDestFilesPlugin.metadata = {
    pluginType: "afterRender",
    name: 'Internal-WriteDestFilesPlugin'
}

exports.writeDestFilesPlugin = writeDestFilesPlugin;