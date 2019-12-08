const cheerio = require('cheerio');

async function ScopeStylesPlugin(modulerizr, currentFile) {
    const $ = cheerio.load(currentFile.content);
    $('*').attr('data-v-' + currentFile.id, "")
    modulerizr.log('start ScopeStylesPlugin ' + currentFile.id);

    const styleTags = $('style');
    return {
        content: $.html($(':root'))
    }
}
ScopeStylesPlugin.metadata = {
    pluginType: "component",
    name: 'Internal-ScopeStylesPlugin'
}

exports.ScopeStylesPlugin = ScopeStylesPlugin;