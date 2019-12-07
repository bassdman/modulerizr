const cheerio = require('cheerio');
const foreachPromise = require('../lib/foreachPromise');

function renderComponentsPlugin(modulerizr, currentFile) {

    const srcFiles = Object.values(modulerizr.get('src'));

    return foreachPromise(srcFiles, async currentFile => {
        const $ = cheerio.load(currentFile.content);

        const $componentsToRender = $('[data-render-comp]').not('[data-rendered]');

        $componentsToRender.each((i, e) => {
            const $currentComp = $(e);
            const componentId = $currentComp.attr('data-component-id');
            const componentElemConfig = currentFile.embeddedComponents[componentId];

            if (componentElemConfig.wrapperTag != null) {
                $currentComp.wrap(componentElemConfig.wrapperTag);
            }

            const componentConfig = Object.values(modulerizr.get('components')).filter(comp => comp.name == componentElemConfig.tag.toLowerCase())[0]

            $currentComp.replaceWith(componentConfig.content);
        });
        modulerizr.set('src', currentFile.key, { content: $.html($(':root')) })
    });
}

renderComponentsPlugin.metadata = {
    pluginType: "afterRender",
    name: 'Internal-RenderComponentsPlugin'
}

exports.renderComponentsPlugin = renderComponentsPlugin;