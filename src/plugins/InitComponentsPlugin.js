const cheerio = require('cheerio');
const fs = require('fs-extra');
const crypto = require('crypto');

async function InitComponentsPlugin(modulerizr, currentFile) {
    const fileContent = await fs.readFile(currentFile.key, "UTF-8")
    const $ = cheerio.load(fileContent);
    const $template = $('template');

    const retVal = Object.assign({
        id: crypto.createHash('md5').update(fileContent).digest("hex").substring(0, 8),
        params: {},
        content: $template.html(),
        original: $.html($template),
        name: $template.attr('name')
    }, currentFile, $template.attributes);

    const attributes = $template.get(0).attribs;

    Object.keys(attributes).forEach(attributeName => {
        if (attributeName.startsWith(':')) {
            retVal.params[attributeName.replace(':', '')] = attributes[attributeName];
            delete retVal[attributeName];
        }
    })

    return retVal;
}
InitComponentsPlugin.metadata = {
    pluginType: "component",
    name: 'Internal-InitComponentsPlugin'
}

exports.InitComponentsPlugin = InitComponentsPlugin;