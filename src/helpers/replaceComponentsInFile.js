function replaceComponentsInSrcFile(srcFile, components) {
    const componentNames = Object.keys(components);
    for (let componentName of componentNames) {
        const componentConfig = components[componentName];
        console.log(componentConfig);
    }
    return srcFile;
}
exports.replaceComponentsInSrcFile = replaceComponentsInSrcFile;