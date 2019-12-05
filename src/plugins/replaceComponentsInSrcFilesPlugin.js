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

        let $component = $(componentConfig.name);
        const componentExists = $component !== null;

        if (!componentExists)
            continue;

        if ($component)

            if (wrapperTag !== '') {
                $component.wrap(wrapperTag)
            }
        $component.replaceWith(componentConfig.content);
    }

    return $.html();
}

exports.replaceComponentsInSrcFilesPlugin = replaceComponentsInSrcFilesPlugin;