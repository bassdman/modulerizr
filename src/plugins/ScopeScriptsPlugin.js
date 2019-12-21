const cheerio = require('cheerio');

function plugin(pluginconfig = {}) {
    const scopedAttributeName = pluginconfig.scopedAttributeName || 'm-scoped';

    async function ScopeScriptsPlugin(modulerizr) {
        return modulerizr.store.each('$.component.*', (currentFile, currentPath) => {
            const $ = cheerio.load(currentFile.content);

            const $scriptTags = $(`script[${scopedAttributeName}]`);
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
                $currentScripts.removeAttr(scopedAttributeName)
            });

            modulerizr.store.value(`${currentPath}.content`, $.html($(':root')))
            return;
        })
    }

    ScopeScriptsPlugin.metadata = {
        pluginType: "initial",
        name: 'Modulerizr-ScopeScriptsPlugin',
        internal: true
    }

    return ScopeScriptsPlugin;
}



exports.ScopeScriptsPlugin = plugin;