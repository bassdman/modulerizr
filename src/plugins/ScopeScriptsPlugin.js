const cheerio = require('cheerio');

class ScopeScriptsPlugin {
    constructor(pluginconfig = {}) {
        this.scopedAttributeName = pluginconfig.scopedAttributeName || 'm-scoped';
        this.internal = true;
    }
    apply(modulerizr) {
        modulerizr.plugins.on('ready', async() => {
            return modulerizr.store.each('$.component.*', (currentFile, currentPath) => {
                const $ = cheerio.load(currentFile.content);

                const $scriptTags = $(`script[${this.scopedAttributeName}]`);
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
                    $currentScripts.removeAttr(this.scopedAttributeName)
                });

                modulerizr.store.value(`${currentPath}.content`, $.html($(':root')))
                return;
            })
        });
    }
}

exports.ScopeScriptsPlugin = ScopeScriptsPlugin;