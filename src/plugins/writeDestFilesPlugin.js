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

    return;
}

function removeLeadSubfoldersFromPath(configSrc, fileSrc) {
    const cleanedConfigSrcPath = path.dirname(fileSrc.replace(/\*/g, '').replace(/\//g, '/'))
    return fileSrc.replace(cleanedConfigSrcPath, "");
}

writeDestFilesPlugin.metadata = {
    pluginType: "afterRender",
    name: 'Modulerizr-WriteDestFilesPlugin',
    internal: true
}

exports.writeDestFilesPlugin = writeDestFilesPlugin;