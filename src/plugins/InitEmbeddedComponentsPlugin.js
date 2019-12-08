const cheerio = require('cheerio');

function InitEmbeddedComponentsPlugin(modulerizr, currentFile) {
    const $ = cheerio.load(currentFile.content);
    const componentNames = Object.keys(modulerizr.get('components'));
    const globalWrapperTag = modulerizr.config.defaultComponentWrapper;
    const embeddedComponents = {};


    for (let componentName of componentNames) {
        const componentConfig = modulerizr.get('components', componentName);

        let $allComponents = $(componentConfig.name);
        const componentExists = $allComponents.length > 0;

        if (!componentExists)
            continue;

        $allComponents.each((i, e) => {
            const componentId = Math.random().toString(36).substr(2, 5) + Math.random().toString(36).substr(2, 5);

            const $currentComp = $(e);

            const original = $.html($currentComp);
            const attributes = Object.assign({}, $currentComp.get(0).attribs);

            $currentComp.attr('data-component-id', componentId);
            $currentComp.attr('data-render-comp', true);

            embeddedComponents[componentId] = {
                id: componentId,
                tag: $currentComp.prop('tagName'),
                content: $.html($currentComp),
                wrapperTag: getWrapperTag(attributes.wrapper || globalWrapperTag),
                innerHtml: $currentComp.html(),
                original,
                attributes,
                slots: getSlots($currentComp, $)
            }
        });
    }

    return {
        embeddedComponents,
        content: $.html(':root')
    }
}

function getSlots($comp, $) {
    const $slots = $comp.find('[slot]');

    const slots = {
        _default: $comp.html()
    }

    $slots.each((i, e) => {
        const $currentSlot = $(e);
        const name = $currentSlot.attr('slot') || '_default';
        slots[name] = $currentSlot.html();
    });

    return slots;
}

function getWrapperTag(componentWrapperTag, configWrapperTag) {
    const initialWrapperTag = componentWrapperTag || configWrapperTag;
    const modifiedWrapperTag = `<${initialWrapperTag}>`.replace('<<', '<').replace('>>', '>');
    return modifiedWrapperTag;
}

InitEmbeddedComponentsPlugin.metadata = {
    pluginType: ['src', 'component'],
    name: 'Internal-InitEmbeddedComponentsPlugin'
}

exports.InitEmbeddedComponentsPlugin = InitEmbeddedComponentsPlugin;