const foreachPromise = require('./foreachPromise');

class SynchronousEventEmitter {
    constructor(config = {}) {
        this.events = {};
        this.beforeEmit = config.beforeEmit; //wird global gesetzt
        this.afterEmit = config.afterEmit;
        this.beforeOn = config.beforeOn;
    }
    async on(eventname, fn) {
        if (eventname == null)
            throw new Error('EventEmitter.on(eventname,fn) - eventname is undefined but required');

        if (fn == null)
            throw new Error('EventEmitter.on(eventname,fn) - fn is undefined but required');

        if (this.events[eventname] == null)
            this.events[eventname] = [];

        if (this.beforeOn)
            await this.beforeOn(eventname, fn);

        this.events[eventname].push(fn);
    }
    async emit(eventname) {
        const plugins = this.events[eventname] || [];

        return await foreachPromise(plugins, async plugin => {
            const args = Array.from(arguments).slice(1, arguments.length);

            if (this.beforeEmit)
                await this.beforeEmit(eventname, plugin);

            const result = await plugin.apply(this, args);

            if (this.afterEmit)
                await this.afterEmit(eventname, result, plugin);
        });
    }
}

exports.SynchronousEventEmitter = SynchronousEventEmitter;