const cheerio = require('cheerio');
const csstree = require('css-tree');

class ScopeStylesPlugin {
    constructor(pluginconfig = {}) {
        this.scopedAttributeName = pluginconfig.scopedAttributeName || 'm-scoped';
        this.name = 'Modulerizr-ScopeStylesPlugin';
        this.internal = true;
    }
    apply(modulerizr) {
        modulerizr.plugins.on('ready', async() => {
            return modulerizr.store.each("$.component.*", (currentFile, currentPath, i) => {
                const $ = cheerio.load(currentFile.content);
                $('*').not('style,script').attr('data-v-' + currentFile.id, "")

                const $styleTags = $(`style[${this.scopedAttributeName}]`);
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
                $styleTags.removeAttr(this.scopedAttributeName);

                modulerizr.store.value(`${currentPath}.content`, $.html(':root'));
                return;
            })
        });
    }
}

exports.ScopeStylesPlugin = ScopeStylesPlugin;