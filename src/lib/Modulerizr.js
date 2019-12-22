const colors = require('colors/safe');
const jp = require('jsonpath');
const { SynchronousEventEmitter } = require('./EventEmitter');


const foreachPromise = require('./foreachPromise');

function Modulerizr(config) {
    const store = {};

    const modulerizr = {
        log(text, color) {
            if (!config.debug)
                return;

            if (color) {
                if (colors[color] == null)
                    throw new Error(colors.red(`Error in function modulerizr.log(someText,color): Color "${color}" does not exist. Please look in package https://www.npmjs.com/package/colors which colors exist."`))
                console.log(colors[color](text));
            } else
                console.log(text);

        },
        config,
        store: {
            query(query, count) {
                if (query == null)
                    throw new Error('Modulerizr.store.query(query[,count]): query is undefined');

                return jp.query(store, query.toLowerCase(), count);
            },
            queryOne(query, count) {
                if (query == null)
                    throw new Error('Modulerizr.store.query(query[,count]): query is undefined');

                return jp.query(store, query.toLowerCase(), count)[0];
            },
            apply(query, fn) {
                if (query == null)
                    throw new Error('Modulerizr.store.apply(query,fn): query is undefined');

                if (fn == null)
                    throw new Error('Modulerizr.store.apply(query,fn): fn is undefined');

                jp.apply(store, query.toLowerCase(), fn);
            },
            value(query, value) {
                if (query == null)
                    throw new Error('Modulerizr.store.value(query): query is undefined');

                jp.value(store, query.toLowerCase(), value);
            },
            paths(query, count) {
                if (query == null)
                    throw new Error('Modulerizr.store.paths(query[,count]): query is undefined');

                return jp.paths(store, query.toLowerCase(), count);
            },
            nodes(query, count) {
                if (query == null)
                    throw new Error('Modulerizr.store.nodes(query[,count]): query is undefined');

                return jp.nodes(store, query.toLowerCase(), count);
            },
            parent(query) {
                if (query == null)
                    throw new Error('Modulerizr.store.parent(query): query is undefined');

                return jp.parent(store, query.toLowerCase(), count);
            },
            each(query, fn) {
                if (query == null)
                    throw new Error('Modulerizr.store.parent(query): query is undefined');

                const nodes = jp.nodes(store, query.toLowerCase()) || [];

                return foreachPromise(nodes, (node, i) => {
                    const _path = node.path.join('.');

                    return fn(node.value, _path, i);
                })
            }
        }
    }

    modulerizr.plugins = new SynchronousEventEmitter({
        beforeEmit(eventname, event) {
            // Desactivtes a plugin if 
            if (modulerizr.store.queryOne(`$.plugins.${event.currentPlugin.constructor.name}.isactive`) === false)
                return false;
            if (modulerizr.store.queryOne(`$.plugins.${event.currentPlugin.constructor.name}.${eventname}.isactive`) === false)
                return false;

            modulerizr.log(`Execute "${eventname}"-event of plugin "${event.currentPlugin.constructor.name  }".`, 'blue');
            modulerizr.plugins.emit(`${event.currentPlugin.constructor.name }_start`);
        },
        afterEmit(eventname, result, event) {
            modulerizr.plugins.emit(`${event.currentPlugin.constructor.name }_finished`);
        },
        beforeOn(eventname, fn) {
            fn.currentPlugin = modulerizr.store.queryOne('$.plugins._current');
        }
    });
    modulerizr.plugins.ignore = function(pluginname, eventname) {
        if (pluginname == null)
            throw new Error('modulerizr.plugins.ignore(pluginname,eventname): pluginname is undefined but required.');

        if (eventname == undefined)
            modulerizr.store.value(`$.plugins.${pluginname}.isactive`, false);
        else
            modulerizr.store.queryOne(`$.plugins.${pluginname}.${eventname}.isactive`, false);
    }

    return modulerizr;
}

exports.Modulerizr = Modulerizr;