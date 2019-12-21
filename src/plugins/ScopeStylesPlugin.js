const cheerio = require('cheerio');
const csstree = require('css-tree');

function plugin(pluginconfig = {}) {
    const scopedAttributeName = pluginconfig.scopedAttributeName || 'm-scoped';

    function ScopeStylesPlugin(modulerizr) {
        return modulerizr.store.each("$.component.*", (currentFile, currentPath, i) => {
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
            });
            $styleTags.removeAttr(scopedAttributeName);

            modulerizr.store.value(`${currentPath}.content`, $.html(':root'));
            return;
        })
    }

    ScopeStylesPlugin.metadata = {
        pluginType: "initial",
        name: 'Modulerizr-ScopeStylesPlugin',
        internal: true
    }
    return ScopeStylesPlugin;
}


exports.ScopeStylesPlugin = plugin;