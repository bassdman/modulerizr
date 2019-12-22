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

                return jp.query(store, query, count);
            },
            queryOne(query, count) {
                if (query == null)
                    throw new Error('Modulerizr.store.query(query[,count]): query is undefined');

                return jp.query(store, query, count)[0];
            },
            apply(query, fn) {
                if (query == null)
                    throw new Error('Modulerizr.store.apply(query,fn): query is undefined');

                if (fn == null)
                    throw new Error('Modulerizr.store.apply(query,fn): fn is undefined');

                jp.apply(store, query, fn);
            },
            value(query, value) {
                if (query == null)
                    throw new Error('Modulerizr.store.value(query): query is undefined');

                jp.value(store, query, value);
            },
            paths(query, count) {
                if (query == null)
                    throw new Error('Modulerizr.store.paths(query[,count]): query is undefined');

                return jp.paths(store, query, count);
            },
            nodes(query, count) {
                if (query == null)
                    throw new Error('Modulerizr.store.nodes(query[,count]): query is undefined');

                return jp.nodes(store, query, count);
            },
            parent(query) {
                if (query == null)
                    throw new Error('Modulerizr.store.parent(query): query is undefined');

                return jp.parent(store, query, count);
            },
            each(query, fn) {
                if (query == null)
                    throw new Error('Modulerizr.store.parent(query): query is undefined');

                const nodes = jp.nodes(store, query) || [];

                return foreachPromise(nodes, (node, i) => {
                    const _path = node.path.join('.');

                    return fn(node.value, _path, i);
                })
            }
        }
    }

    modulerizr.plugins = new SynchronousEventEmitter({
        beforeEmit(eventname, event) {

            modulerizr.log(colors.green(`Run ${eventname}-event of plugin "${event.currentPlugin.constructor.name  }".`));
        },
        beforeOn(eventname, fn) {
            fn.currentPlugin = modulerizr.store.queryOne('$.plugins.current');
        }
    });

    return modulerizr;
}

exports.Modulerizr = Modulerizr;