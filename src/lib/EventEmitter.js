const foreachPromise = require('./foreachPromise');

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
        });
    }
}

exports.SynchronousEventEmitter = SynchronousEventEmitter;