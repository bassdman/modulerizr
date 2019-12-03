const { replaceComponentsInSrcFile } = require("./helpers/replaceComponentsInFile");

const { writeFiles } = require("./lib/writeFiles");
const foreachPromise = require('./lib/foreachPromise');
const { getFileContent } = require("./lib/getFileContent");
const { globFiles } = require("./lib/globFiles");

const HTMLParser = require('node-html-parser');

async function modulerizr(config) {
    const files = { components: {}, src: {} };

    const srcFileNames = await globFiles(prepareConfigEntry(config.src), config._rootPath);
    const componentFileNames = await globFiles(prepareConfigEntry(config.components), config._rootPath);

    const componentFiles = await getComponents(componentFileNames);
    const srcFiles = await getFileContent(srcFileNames, { mode: 'object' });
    const replacedDestFiles = replaceComponentsInSrcFiles(srcFiles, componentFiles);

    return writeFiles(config.dest, replacedDestFiles);
}

function replaceComponentsInSrcFiles(srcFiles, components) {
    const srcFileNames = Object.keys(srcFiles);
    const replacedFiles = {};

    for (let file of srcFileNames) {
        const originalContent = srcFiles[file];
        const replacedContent = replaceComponentsInSrcFile(originalContent, components);
        replacedFiles[file] = replacedContent;
    }
    return replacedFiles;
}

async function getComponents(componentFiles) {
    const retVal = {};

    await foreachPromise(componentFiles, async fileName => {
        const fileContent = await getFileContent(prepareConfigEntry(fileName));
        const root = HTMLParser.parse(fileContent);
        const template = root.querySelector('template');

        retVal[fileName] = Object.assign({ params: {} }, componentFiles[fileName], template.attributes);

        Object.keys(template.attributes).forEach(attributeKey => {
            if (attributeKey.startsWith('param-')) {
                retVal[fileName].params[attributeKey.replace('param-', '')] = template.attributes[attributeKey];
                delete retVal[fileName][attributeKey];
            }
        })
    });

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