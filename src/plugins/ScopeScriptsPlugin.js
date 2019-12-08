const cheerio = require('cheerio');

async function ScopeScriptsPlugin(modulerizr, currentFile) {
    const $ = cheerio.load(currentFile.content);

    const $scriptTags = $('script[scoped]');
    $scriptTags.each((i, e) => {
        const $currentScripts = $(e);

        const scopedScript = `(function(window){${$currentScripts.html()}})(window);`;
        $currentScripts.html(scopedScript);
        $currentScripts.removeAttr("scoped")
    });

    return {
        content: $.html($(':root'))
    }
}
ScopeScriptsPlugin.metadata = {
    pluginType: "component",
    name: 'Internal-ScopeScriptsPlugin'
}

exports.ScopeScriptsPlugin = ScopeScriptsPlugin;