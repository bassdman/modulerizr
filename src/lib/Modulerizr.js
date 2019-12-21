const colors = require('colors/safe');
const jp = require('jsonpath');
const files = {
    components: {},
    src: {},
    embeddedComponents: {}
};
const store = {};

function Modulerizr(config) {
    return {
        set(type, name, obj) {
            if (name == null)
                throw new Error('Modulerizr.set(type,name,config): Name is not defined. Which Src-File do you mean?');

            if (!typeof obj == 'object')
                throw new Error('Modulerizr.set(type,name,config): config must be an object.');

            if (files[type] == null) {
                files[type] = {};
            }

            files[type][name] = Object.assign((files[type][name] || {}), obj);
        },
        get(type, name) {
            if (name == null) {
                return files[type];
            }

            if (files[type] == null) {
                files[type] = {};
            }
            return files[type][name];
        },
        exists(type, name) {
            const value = this.get(type, name);
            return value != null;
        },
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

                jp.query(store, query, count);
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

                const paths = jp.paths(store, query) || [];

                for (let i in paths) {
                    const path = paths[i].join('.');
                    const value = jp.value(store, path);

                    fn(value, path, i);
                }
            }
        }
    }
}

exports.Modulerizr = Modulerizr;
exports.components = files.components;
exports.src = files.src