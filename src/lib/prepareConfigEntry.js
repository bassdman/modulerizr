function prepareConfigEntry(src) {
    if (src == undefined)
        throw new Error('modulerizr.config.src: src is undefined but required.');
    if (Array.isArray(src))
        return src;
    return [src];
}
exports.prepareConfigEntry = prepareConfigEntry;