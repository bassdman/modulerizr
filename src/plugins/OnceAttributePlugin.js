const cheerio = require('cheerio');
const crypto = require('crypto');

async function OnceAttributePlugin(modulerizr, currentFile) {
    const $ = cheerio.load(currentFile.content);

    const $onceAttributes = $('[once]');
    $onceAttributes.each((i, e) => {
        const $currentOnceAttribute = $(e);
        const htmlToValidate = $.html($currentOnceAttribute).replace(/\s/g, "");

        const elementHash = crypto.createHash('md5').update(htmlToValidate).digest("hex").substring(0, 16);

        if (modulerizr.exists('onceAttibutePlugin', elementHash)) {

            $currentOnceAttribute.replaceWith('<!-- This element had the attribute "once" and already exists before -->');
            return;
        }
        modulerizr.set('onceAttibutePlugin', elementHash, true);
    });

    return {
        content: $.html($(':root'))
    }
}
OnceAttributePlugin.metadata = {
    pluginType: "component",
    name: 'Modulerizr-OnceAttributePlugin',
    internal: true
}

exports.OnceAttributePlugin = OnceAttributePlugin;