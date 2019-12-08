const cheerio = require('cheerio');
const foreachPromise = require('../lib/foreachPromise');

function PreRenderPlugin(modulerizr, currentFile) {

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
            const replacedContent = replaceSlots(componentConfig.content, componentElemConfig);
            $currentComp.replaceWith(replacedContent.trim());
        });
        modulerizr.set('src', currentFile.key, { content: $.html($(':root')) })
    });
}

function replaceSlots(currentContent, componentElemConfig) {
    const $ = cheerio.load(currentContent);

    const $slots = $(':root').find('slot');
    $slots.each((i, e) => {
        const $currentSlot = $(e);
        const name = $currentSlot.attr('name') || '_default';
        const newContent = componentElemConfig.slots[name] || $currentSlot.html();

        $currentSlot.replaceWith(newContent);
    });
    return $(':root').html();
}

PreRenderPlugin.metadata = {
    pluginType: "afterRender",
    name: 'Internal-PreRenderPlugin'
}

exports.PreRenderPlugin = PreRenderPlugin;