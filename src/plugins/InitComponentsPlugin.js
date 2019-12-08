const cheerio = require('cheerio');
const fs = require('fs-extra');


async function InitComponentsPlugin(modulerizr, currentFile) {
    const fileContent = await fs.readFile(currentFile.key, "UTF-8")
    const $ = cheerio.load(fileContent);
    const $template = $('template');

    const retVal = Object.assign({ params: {} }, currentFile, $template.attributes);
    retVal.content = $template.html();
    retVal.original = $.html($template);
    retVal.name = $template.attr('name');
    const attributes = $template.get(0).attribs;

    Object.keys(attributes).forEach(attributeName => {
        if (attributeName.startsWith('param-')) {
            retVal.params[attributeName.replace('param-', '')] = attributes[attributeName];
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