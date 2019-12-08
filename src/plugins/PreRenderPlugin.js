const cheerio = require('cheerio');
const foreachPromise = require('../lib/foreachPromise');

function PreRenderPlugin(modulerizr, currentFile) {

    const srcFiles = Object.values(modulerizr.get('src'));

    return foreachPromise(srcFiles, async currentFile => {
        let allComponentsRendered = false;
        let level = 1;
        let content = currentFile.content;

        while (!allComponentsRendered) {
            content = render(modulerizr, currentFile, content);
            const $ = cheerio.load(content);
            if ($('[data-render-comp]').length == 0)
                allComponentsRendered = true;

            if (level >= modulerizr.config.maxRecursionLevel) {
                throw new Error('There is a Problem with infinite recursion in nested Elements. Sth like Component "A" includes Component "B"  and Component "B" includes Component "A". This leads to an infinite loop. Please fix this.');
            }
            level++;
        }


    });
}

function render(modulerizr, currentFile, content) {
    const $ = cheerio.load(content);

    const $componentsToRender = $('[data-render-comp]');

    $componentsToRender.each((i, e) => {
        const $currentComp = $(e);
        const componentId = $currentComp.attr('data-component-id');
        const componentElemConfig = modulerizr.get('embeddedComponents', componentId);

        if (componentElemConfig.wrapperTag != null) {
            $currentComp.wrap(componentElemConfig.wrapperTag);
        }

        const componentConfig = Object.values(modulerizr.get('components')).filter(comp => comp.name == componentElemConfig.tag.toLowerCase())[0]
        const replacedContent = replaceSlots(componentConfig.content, componentElemConfig);
        $currentComp.replaceWith(replacedContent.trim());
    });
    modulerizr.set('src', currentFile.key, { content: $.html($(':root')) })

    return $(':root').html();
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