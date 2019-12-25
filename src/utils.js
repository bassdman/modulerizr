const glob = require('glob');

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


function globFiles(src, rootPath) {
    const files = [];
    return foreachPromise(src, srcEntry => {
            return new Promise((resolve, reject) => {
                    glob(srcEntry, { root: rootPath }, (err, result) => {
                        resolve(result);
                    });
                })
                .then(filesGlob => files.push(filesGlob));
        })
        .then(() => {
            // schaut komisch aus, löst aber die Arrays in mehreren Hierarchien auf.
            return files.join(',').split(',');
        })
        .then((_files) => {
            if (_files.length == 1 && files[0] == '')
                return [];

            // schaut komisch aus, löst aber die Arrays in mehreren Hierarchien auf.
            return files.join(',').split(',');
        });
}

class SynchronousEventEmitter {
    constructor(config = {}) {
        this.events = {};
        this.beforeEmit = config.beforeEmit; //wird global gesetzt
        this.afterEmit = config.afterEmit;
        this.beforeOn = config.beforeOn;
    }
    async on(_eventname, fn) {
        if (_eventname == null)
            throw new Error('EventEmitter.on(eventname,fn) - eventname is undefined but required');

        if (fn == null)
            throw new Error('EventEmitter.on(eventname,fn) - fn is undefined but required');

        const eventname = _eventname.toLowerCase();
        if (this.events[eventname] == null)
            this.events[eventname] = [];

        if (this.beforeOn)
            await this.beforeOn(eventname, fn);

        this.events[eventname].push(fn);
    }
    async emit(_eventname) {
        if (_eventname == null)
            throw new Error('SynchronousEventEmitter.emit(eventname): eventname is undefined but required');

        const eventname = _eventname.toLowerCase();
        const plugins = this.events[eventname] || [];

        return await foreachPromise(plugins, async plugin => {
            const args = Array.from(arguments).slice(1, arguments.length);

            let beforeEmitResult = this.beforeEmit ? await this.beforeEmit(eventname, plugin) : undefined;

            if (beforeEmitResult === false)
                return;

            const result = await plugin.apply(this, args);

            if (this.afterEmit)
                await this.afterEmit(eventname, result, plugin);

            return;
        });
    }
}

exports.SynchronousEventEmitter = SynchronousEventEmitter;
exports.globFiles = globFiles;
exports.ensureArray = ensureArray;
exports.foreachPromise = foreachPromise;