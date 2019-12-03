module.exports = function(items, fn) {
    return items.reduce(function(promise, item) {
        return promise.then(function() {
            return fn(item);
        });
    }, Promise.resolve());
}