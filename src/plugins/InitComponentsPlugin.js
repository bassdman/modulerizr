const cheerio = require('cheerio');
const fs = require('fs-extra');
const crypto = require('crypto');

const { globFiles } = require("../lib/globFiles");
const { ensureArray } = require('../lib/utils');
const foreachPromise = require('../lib/foreachPromise');

class InitComponentsPlugin {
    constructor(pluginconfig = {}) {
        this.name = 'Modulerizr-InitComponentsPlugin';
        this.internal = true;
    }
    async apply(modulerizr) {
        if (modulerizr.config.components == undefined)
            throw new Error('Error in your modulerizr.config: "src" is undefined but required.', 'red');

        modulerizr.plugins.on('init', async() => {
            console.log('start init initcomponentplugin');

            const componentFiles = await globFiles(ensureArray(modulerizr.config.components), modulerizr.config._rootPath);
            logFoundFiles(componentFiles, modulerizr);

            return foreachPromise(componentFiles, async fileName => {
                const fileContent = await fs.readFile(fileName, "UTF-8");
                const $ = cheerio.load(fileContent);
                const $template = $('template');

                const retVal = Object.assign({
                    id: crypto.createHash('md5').update(fileContent).digest("hex").substring(0, 8),
                    params: {},
                    key: fileName,
                    content: $template.html(),
                    original: $.html($template),
                    name: $template.attr('name')
                }, $template.attributes);

                const attributes = $template.get(0).attribs;

                Object.keys(attributes).forEach(attributeName => {
                    if (attributeName.startsWith(':')) {
                        retVal.params[attributeName.replace(':', '')] = attributes[attributeName];
                        delete retVal[attributeName];
                    }
                })

                modulerizr.store.value(`$.component.id_${retVal.id}`, retVal)

                return retVal;
            })
            console.log('ende init initcomponentplugin');
        });
    }
}

function logFoundFiles(fileNames, modulerizr) {
    if (fileNames.length == 0) {
        modulerizr.log(`Sorry, no component-files found. Modify the attribute "components" in your modulerizr config to match some files.`, 'red');
    } else {
        modulerizr.log(`Found the following component-files:`, 'green');
        fileNames.forEach(file => modulerizr.log(`   - ${file}`));
    }
}

exports.InitComponentsPlugin = InitComponentsPlugin;