const cheerio = require('cheerio');

function PreRenderPlugin(modulerizr, currentFile) {
    return modulerizr.store.each("$.src.*", (currentFile, currentPath, i) => {
        let allComponentsRendered = false;
        let level = 1;
        let content = currentFile.content;

        while (!allComponentsRendered) {
            content = render(modulerizr, currentPath, content);
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

function render(modulerizr, currentPath, content) {
    const $ = cheerio.load(content);

    const $componentsToRender = $('[data-render-comp]');
    $componentsToRender.each((i, e) => {
        const $currentComp = $(e);
        const componentId = $currentComp.attr('data-component-id');
        const componentElemConfig = modulerizr.store.queryOne(`$.embeddedComponents.id_${componentId}`);

        if (componentElemConfig.wrapperTag != null) {
            $currentComp.wrap(componentElemConfig.wrapperTag);
            $currentComp.parent()
                .attr("data-v-" + componentElemConfig.componentId, "")
                .attr("id", componentElemConfig.componentId)
                .attr("data-component", componentElemConfig.tag)
        }

        const componentConfig = modulerizr.store.queryOne(`$.component.id_${componentElemConfig.componentId}`);

        const replacedContent = replaceSlots(componentConfig.content, componentElemConfig);
        $currentComp.replaceWith(replacedContent.trim());
    });
    modulerizr.store.value(`${currentPath}.content`, $.html($(':root')));

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
    name: 'Modulerizr-PreRenderPlugin',
    internal: true
}

exports.PreRenderPlugin = PreRenderPlugin;