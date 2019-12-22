const foreachPromise = require('./foreachPromise');

class SynchronousEventEmitter {
    constructor() {
        this.events = {}
    }
    on(eventname, fn) {
        if (eventname == null)
            throw new Error('EventEmitter.on(eventname,fn) - eventname is undefined but required');

        if (fn == null)
            throw new Error('EventEmitter.on(eventname,fn) - fn is undefined but required');

        if (this.events[eventname] == null)
            this.events[eventname] = [];

        this.events[eventname].push(fn);
    }
    async emit(eventname) {
        const plugins = this.events[eventname] || [];

        return await foreachPromise(plugins, async plugin => {
            const args = Array.from(arguments).slice(1, arguments.length);
            await plugin.apply(this, args);
        });
    }
}

exports.SynchronousEventEmitter = SynchronousEventEmitter;