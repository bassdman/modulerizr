const cheerio = require('cheerio');

async function ScopeScriptsPlugin(modulerizr, currentFile) {
    const $ = cheerio.load(currentFile.content);

    const $scriptTags = $('script[scoped]');
    $scriptTags.each((i, e) => {
        const $currentScripts = $(e);

        const scopedScript = `(function(window){
            var $m = {
                id: '${currentFile.id}',
                name: '${currentFile.name}',
                $el: document.getElementById('${currentFile.id}'),
                params: {},
                slots: {}
            };
            ${$currentScripts.html()}
        })(window);`;
        $currentScripts.html(scopedScript);
        $currentScripts.removeAttr("scoped")
    });

    return {
        content: $.html($(':root'))
    }
}
ScopeScriptsPlugin.metadata = {
    pluginType: "component",
    name: 'Modulerizr-ScopeScriptsPlugin',
    internal: true
}

exports.ScopeScriptsPlugin = ScopeScriptsPlugin;