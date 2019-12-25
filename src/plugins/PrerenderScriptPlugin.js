const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

const { foreachPromise } = require('../lib/utils');


class PrerenderScriptPlugin {
    constructor(pluginconfig = {}) {
        this.serversideAttributeName = pluginconfig.scopedAttributeName || 'm-prerenderscript';
        this.internal = true;
    }
    apply(modulerizr) {
        modulerizr.plugins.on('afterRender', async() => {

            return await modulerizr.store.$each('$.src.*', async($, currentFile, currentPath) => {
                const $scriptTags = $(`script[${this.serversideAttributeName}]`);

                await foreachPromise($scriptTags, async e => {
                    const $currentScript = $(e);

                    const tempFileHash = crypto.createHash('md5').update($currentScript.html().trim()).digest("hex").substring(0, 8);
                    const tempFilename = "./_temp/temp_" + tempFileHash + '.js';

                    await fs.ensureDir(path.dirname(tempFilename));
                    await fs.writeFile(tempFilename, $currentScript.html().trim());

                    const returnValue = require(path.join(modulerizr.config._rootPath, tempFilename));

                    const data = typeof returnValue.data == 'function' ? returnValue.data() : returnValue.data;

                    const embeddedComponentId = $currentScript.parent('[data-component-instance]').attr('data-component-instance');
                    const embeddedComponent = modulerizr.store.queryOne(`$.embeddedComponents.id_${embeddedComponentId}`);
                    const componentPrerenderData = modulerizr.store.queryOne(`$.component.id_${embeddedComponent.componentId}.preRenderData`) || {};

                    const mappedData = Object.assign({}, componentPrerenderData, data);
                    modulerizr.store.value(`$.component.id_${embeddedComponent.componentId}.preRenderData`, mappedData);
                });
            })
        })

        modulerizr.plugins.on('finish', async() => {
            modulerizr.store.$each("$.src.*", async($, currentFile, currentPath, i) => {
                $(`[${this.serversideAttributeName}]`).remove();
                await fs.remove('./_temp');
            });
        })
    }
}

exports.PrerenderScriptPlugin = PrerenderScriptPlugin;