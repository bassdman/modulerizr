const cheerio = require('cheerio');
const csstree = require('css-tree');


async function ScopeStylesPlugin(modulerizr, currentFile) {
    const $ = cheerio.load(currentFile.content);
    $('*').attr('data-v-' + currentFile.id, "")
    modulerizr.log('start ScopeStylesPlugin ' + currentFile.id);

    const $styleTags = $('style[scoped]');
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
        $currentStyles.removeAttr("scoped")
    });

    return {
        content: $.html($(':root'))
    }
}
ScopeStylesPlugin.metadata = {
    pluginType: "component",
    name: 'Internal-ScopeStylesPlugin'
}

exports.ScopeStylesPlugin = ScopeStylesPlugin;