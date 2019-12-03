const { writeFiles } = require("./lib/writeFiles");

const { getFileContent } = require("./lib/getFileContent");
const { globFiles } = require("./lib/globFiles");

const HTMLParser = require('node-html-parser');

async function modulerizr(config) {
    const files = { components: {}, src: {} };

    const srcFiles = await globFiles(prepareConfigEntry(config.src), config._rootPath);
    const componentFiles = await globFiles(prepareConfigEntry(config.components), config._rootPath);

    const srcFilesConfig = await getFileContent(srcFiles, { mode: 'object' });
    let componentFilesConfigs = await getFileContent(componentFiles, { mode: 'object' });
    componentFilesConfigs = addComponentConfig(componentFilesConfigs);
    let destFilesConfig = JSON.parse(JSON.stringify(srcFilesConfig));
    //  destFilesConfig = replaceComponents(componentFilesConfigs)

    console.log(componentFilesConfigs)
    return writeFiles(config.dest, destFilesConfig);
}

function addComponentConfig(componentFiles) {
    const retVal = {};
    Object.keys(componentFiles).forEach(fileName => {
        const root = HTMLParser.parse(componentFiles[fileName].content);
        const template = root.querySelector('template');

        retVal[fileName] = Object.assign({ params: {} }, componentFiles[fileName], template.attributes);

        Object.keys(template.attributes).forEach(attributeKey => {
            if (attributeKey.startsWith('param-')) {
                retVal[fileName].params[attributeKey.replace('param-', '')] = template.attributes[attributeKey];
                delete retVal[fileName][attributeKey];
            }
        })
    })

    return retVal;
}

function prepareConfigEntry(src) {
    if (src == undefined)
        throw new Error('modulerizr.config.src: src is undefined but required.');

    if (Array.isArray(src))
        return src;

    return [src];

}

module.exports = modulerizr;