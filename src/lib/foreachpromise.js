module.exports = function(items, fn) {
    let i = -1;
    return items.reduce(function(promise, item) {
        return promise.then(function() {
            i++;
            return fn(item, i);
        });
    }, Promise.resolve());
}