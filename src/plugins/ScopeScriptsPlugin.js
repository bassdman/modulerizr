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
                        var _m = {
                            id: "${currentFile.id}",
                            name: "${currentFile.name}",
                            $el: document.getElementById("${currentFile.id}"),
                            attributes: ##component.attributes##,
                            slots: ##component.slots##
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
                    const $currentScript = $(e);
                    const embeddedComponentId = $currentScript.parent('[data-component-instance]').attr('data-component-instance');
                    const embeddedComponent = modulerizr.store.queryOne(`$.embeddedComponents.id_${embeddedComponentId}`);

                    const replacedScript = $currentScript.html()
                        .replace('##component.attributes##', JSON.stringify(embeddedComponent.attributes))
                        .replace('##component.slots##', JSON.stringify(embeddedComponent.slots));

                    $currentScript.html(replacedScript);
                });
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