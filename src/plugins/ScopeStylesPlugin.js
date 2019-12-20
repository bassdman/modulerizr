const cheerio = require('cheerio');
const csstree = require('css-tree');

function plugin(pluginconfig = {}) {
    const scopedAttributeName = pluginconfig.scopedAttributeName || 'm-scoped';

    function ScopeStylesPlugin(modulerizr, currentFile) {
        const $ = cheerio.load(currentFile.content);
        $('*').not('style,script').attr('data-v-' + currentFile.id, "")

        const $styleTags = $(`style[${scopedAttributeName}]`);
        $styleTags.each((i, e) => {
            const $currentStyles = $(e);
            const ast = csstree.parse($currentStyles.html());
            csstree.walk(ast, function(node) {
                if (node.type === 'ClassSelector') {
                    node.name = `${node.name}[data-v-${currentFile.id}]`;
                }
            });
            const parsedStyles = csstree.generate(ast);
            $currentStyles.html(parsedStyles);
            $currentStyles.removeAttr(scopedAttributeName)
        });

        return {
            content: $.html($(':root'))
        }
    }

    ScopeStylesPlugin.metadata = {
        pluginType: "component",
        name: 'Modulerizr-ScopeStylesPlugin',
        internal: true
    }
    return ScopeStylesPlugin;
}


exports.ScopeStylesPlugin = plugin;