const colors = require('colors/safe');
const jp = require('jsonpath');
const cheerio = require('cheerio');

const getLogger = require('webpack-log');
const { HtmlReplaceWebpackPlugin } = require('./plugins/HtmlReplaceWebpackPlugin')


const { foreachPromise } = require('./utils');

function Modulerizr(config, compiler) {
    const store = {};
    const log = getLogger({
        name: config.logName || 'modulerizr',
        level: config.logLevel || 'trace',
        timestamp: config.logTimeStamp || false
    });


    const modulerizr = {
        log(message, logLevel = 'debug') {
            if (!config.debug)
                return;

            const availableLogLevels = ['debug', 'warn', 'error', 'info', 'trace'];

            if (!availableLogLevels.includes(logLevel))
                throw new Error(colors.red(`Error in function modulerizr.log(someText,logLevel): Loglevel "${logLevel}" does not exist. It must be one of the followings: ${availableLogLevels.join(',')}"`))

            log[logLevel](message)

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

                return nodes.forEach((node, i) => {
                    const _path = node.path.join('.');

                    fn(node.value, _path, i);
                })
            },
            eachPromise(query, fn) {
                if (query == null)
                    throw new Error('Modulerizr.store.parent(query): query is undefined');

                const nodes = jp.nodes(store, query.toLowerCase()) || [];

                return foreachPromise(nodes, async(node, i) => {
                    const _path = node.path.join('.');

                    await fn(node.value, _path, i);
                })
            },
            save(node) {

            },
            $each(_query, fn) {
                if (_query == null)
                    throw new Error('Modulerizr.store.parent(query): query is undefined');

                const query = _query.split('/')[0];
                const selector = _query.split('/').length > 1 ? _query.split('/')[1] : undefined;

                const nodes = jp.nodes(store, query.toLowerCase()) || [];

                return nodes.forEach((node, i) => {
                    const _path = node.path.join('.');
                    const $el = node.value.content ? cheerio.load(node.value.content) : undefined;

                    if (selector == null) {
                        fn($el, node.value, _path, i);
                    } else {
                        const $tags = $el(selector);

                        $tags.each((i, el) => {
                            const $currentTag = $el(el);
                            fn($currentTag, $el, _path, i);

                        });
                    }

                    if ($el !== undefined) {
                        this.value(`${_path}.content`, $el.html(':root'))
                        new HtmlReplaceWebpackPlugin([{
                            filePath: node.value.absolutePath,
                            pattern: /.*/s,
                            x: 'a',
                            replacement: $el.html(':root')
                        }]).apply(compiler);

                    }
                })
            },
            $eachPromise(_query, fn) {
                if (_query == null)
                    throw new Error('Modulerizr.store.parent(query): query is undefined');

                const query = _query.split('/')[0];
                const selector = _query.split('/').length > 1 ? _query.split('/')[1] : undefined;

                const nodes = jp.nodes(store, query.toLowerCase()) || [];

                return foreachPromise(nodes, async(node, i) => {
                    const _path = node.path.join('.');
                    const $el = node.value.content ? cheerio.load(node.value.content) : undefined;

                    if (selector == null) {
                        await fn($el, node.value, _path, i);
                    } else {
                        const $tags = $el(selector);

                        await foreachPromise($tags, async e => {
                            const $currentTag = $el(e);
                            await fn($currentTag, $el, _path, i);
                        });

                    }

                    if ($el !== undefined) {
                        this.value(`${_path}.content`, $el.html(':root'));
                        new HtmlReplaceWebpackPlugin([{
                            filePath: node.value.absolutePath,
                            pattern: node.value.content,
                            x: 'b',
                            replacement: $el.html(':root')
                        }]).apply(compiler);
                    }
                })
            }
        }
    }

    return modulerizr;
}

exports.Modulerizr = Modulerizr;