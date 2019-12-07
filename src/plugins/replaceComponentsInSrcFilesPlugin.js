const cheerio = require('cheerio');

function replaceComponentsInSrcFilesPlugin(currentFile, fileStore, config) {

    const originalContent = currentFile.content;
    const replacedContent = resolveComponents(currentFile, fileStore, config.wrapperTag);
    return {
        content: replacedContent
    }
}

function resolveComponents(srcFile, fileStore, wrapperTag = '<span>') {
    const $ = cheerio.load(srcFile.content);

    const componentNames = Object.keys(fileStore.get('components'));
    for (let componentName of componentNames) {
        const componentConfig = fileStore.get('components', componentName);

        let $allComponents = $(componentConfig.name);
        const componentExists = $allComponents.length > 0;

        if (!componentExists)
            continue;

        $allComponents.each((i, e) => {
            const componentId = Math.random().toString(36).substr(2, 5) + Math.random().toString(36).substr(2, 5);

            const $currentComp = $(e);

            const componentAttributes = $currentComp.get(0).attribs || {};
            console.log(componentAttributes)
            const wrapper = getWrapperTag(componentAttributes.wrapper || wrapperTag);
            if (wrapper != null) {
                $currentComp.wrap(wrapper);
            }
            $currentComp.replaceWith(componentConfig.content);
        })
    }

    return $.html();
}

function getWrapperTag(componentWrapperTag, configWrapperTag) {
    const initialWrapperTag = componentWrapperTag || configWrapperTag;
    const modifiedWrapperTag = `<${initialWrapperTag}>`.replace('<<', '<').replace('>>', '>');
    return modifiedWrapperTag;
}
exports.replaceComponentsInSrcFilesPlugin = replaceComponentsInSrcFilesPlugin;