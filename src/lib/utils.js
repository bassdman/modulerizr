function ensureArray(value) {
    if (!Array.isArray(value))
        return [value];

    return value;
}

function foreachPromise(items, fn) {
    let iterationItems = items;
    if (items.each && items.html && items.attr && items.val) {
        iterationItems = [];
        items.each((i, e) => iterationItems.push(e));
    }

    let i = -1;
    return iterationItems.reduce(function(promise, item) {
        return promise.then(function() {
            i++;
            return fn(item, i);
        });
    }, Promise.resolve());
}

exports.ensureArray = ensureArray;
exports.foreachPromise = foreachPromise;