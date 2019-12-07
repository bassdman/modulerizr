const foreachPromise = require('./foreachPromise');
const path = require('path');
const fs = require('fs-extra');

async function writeFiles(modulerizr, destpath) {
    const files = modulerizr.get('src');

    return foreachPromise(Object.keys(files), async file => {
        const fileconfig = modulerizr.get('src', file);
        const filePath = path.join(destpath, removeLeadSubfoldersFromPath(modulerizr.config.src, file));
        const fileContent = fileconfig.content;

        await fs.ensureDir(destpath);
        return await fs.writeFile(filePath, fileContent);
    });
}

function removeLeadSubfoldersFromPath(configSrc, fileSrc) {
    const cleanedConfigSrcPath = path.dirname(fileSrc.replace(/\*/g, '').replace(/\//g, '/'))
    return fileSrc.replace(cleanedConfigSrcPath, "");
}
exports.writeFiles = writeFiles;