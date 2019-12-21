const cheerio = require('cheerio');
const crypto = require('crypto');

function plugin(pluginconfig = {}) {
    const scopedAttributeName = pluginconfig.scopedAttributeName || 'm-once';

    async function OnceAttributePlugin(modulerizr) {
        return modulerizr.store.each("$.src.*", (currentFile, currentPath, i) => {
            const onceAttributes = {};
            const $ = cheerio.load(currentFile.content);

            logIfExternalScriptWithoutOnceFound(modulerizr, $, scopedAttributeName);

            //identical style Tags are automatically rendered once
            $('style').attr(scopedAttributeName, "");

            const $onceAttributes = $(`[${scopedAttributeName}]`);
            $onceAttributes.each((i, e) => {
                const $currentOnceAttribute = $(e);
                const htmlToValidate = $.html($currentOnceAttribute).replace(/\s/g, "");

                const elementHash = crypto.createHash('md5').update(htmlToValidate).digest("hex").substring(0, 16);
                if (onceAttributes[elementHash] != null) {
                    $currentOnceAttribute.replaceWith('<!-- Here was a component with attribute "m-once", which also exists above. -->');
                    return;
                }
                onceAttributes[elementHash] = true;
            });
            modulerizr.store.value(`${currentPath}.content`, $.html($(':root')));
        });
    }
    OnceAttributePlugin.metadata = {
        pluginType: "afterRender",
        name: 'Modulerizr-OnceAttributePlugin',
        internal: true
    }

    return OnceAttributePlugin;
}

function logIfExternalScriptWithoutOnceFound(modulerizr, $, onceAttributeName) {
    const $externalScriptsWithoutOnceAttr = $('[data-component] script[src]').not(`[${onceAttributeName}]`);
    const $externalStylesWithoutOnceAttr = $('[data-component] link[href]').not(`[${onceAttributeName}]`);
    const alreadyLoggedCache = {};
    $externalScriptsWithoutOnceAttr.each((i, elem) => {
        const srcEntry = $(elem).attr('src');
        if ($(elem).attr('nolog') !== undefined || alreadyLoggedCache[srcEntry] !== undefined)
            return;

        alreadyLoggedCache[srcEntry] = true;
        modulerizr.log(`   Script "${srcEntry}" in component "${$(elem).parent('[data-component]').data('component')}" has not a once-attribute. This means, it is executed each time your component is rendered. Is this your purpose? If yes, add attribute "nolog" to hide these logs.\n`, 'yellow')
    });

    $externalStylesWithoutOnceAttr.each((i, elem) => {
        const srcEntry = $(elem).attr('href');

        if ($(elem).attr('nolog') !== undefined || alreadyLoggedCache[srcEntry] !== undefined)
            return;

        alreadyLoggedCache[srcEntry] = true;
        modulerizr.log(`   Style "${$(elem).attr('href')}" in component "${$(elem).parent('[data-component]').data('component')}" has not a once-attribute. This means, it is executed each time your component is rendered. Is this your purpose? If yes, add attribute "nolog" to hide these logs.\n`, 'yellow')
    });
}

exports.OnceAttributePlugin = plugin;