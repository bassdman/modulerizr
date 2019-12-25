class ScopeScriptsPlugin {
    constructor(pluginconfig = {}) {
        this.scopedAttributeName = pluginconfig.scopedAttributeName || 'm-scoped';
        this.internal = true;
    }
    apply(modulerizr) {
        modulerizr.plugins.on('ready', async() => {
            return modulerizr.store.$each('$.component.*', ($, currentFile, currentPath) => {
                const $scriptTags = $(`script[${this.scopedAttributeName}]`);
                $scriptTags.each((i, e) => {
                    const $currentScripts = $(e);

                    const scopedScript = `(function(window){
                        var $m = {
                            id: '${currentFile.id}',
                            name: '${currentFile.name}',
                            $el: document.getElementById('${currentFile.id}'),
                            params: ##el.params##,
                            slots: ##el.slots##
                        };
                        ${$currentScripts.html()}
                    })(window);`;
                    $currentScripts.html(scopedScript);
                });
            })
        });

        modulerizr.plugins.on('afterRender', async() => {
            modulerizr.store.$each('$.src.*', ($, currentFile, currentPath) => {
                const $scriptTags = $(`script[${this.scopedAttributeName}]`);
                $scriptTags.each((i, e) => {
                    const $currentScripts = $(e);

                    console.log($currentScripts);

                });
                return;
            })
        })

        modulerizr.plugins.on('finish', () => {
            return modulerizr.store.$each("$.src.*", ($, currentFile, currentPath, i) => {
                $(`[${this.scopedAttributeName}]`).removeAttr(this.scopedAttributeName);
            });
        })
    }
}

exports.ScopeScriptsPlugin = ScopeScriptsPlugin;