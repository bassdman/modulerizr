const colors = require('colors/safe');
const jp = require('jsonpath');
const { SynchronousEventEmitter } = require('./EventEmitter');


const foreachPromise = require('./foreachPromise');

function Modulerizr(config) {
    const store = {};

    return {
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
        plugins: new SynchronousEventEmitter(),
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
}

exports.Modulerizr = Modulerizr;