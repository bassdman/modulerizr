const { foreachPromise } = require('./utils');
const { Modulerizr } = require('./Modulerizr');
const color = require('colors');

const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const AsyncSeriesHook = require('tapable').AsyncSeriesHook;



async function run(_config) {
    let config = _config;

    if (!Array.isArray(config))
        config = [config];

    await foreachPromise(config, async conf => await runOne(conf));
}

async function runOne(_config) {
    const defaultConfig = require('../modulerizr.default.config.js');
    const config = Object.assign(defaultConfig, _config);
    config.plugins = (config._plugins).concat(config.plugins || []);


    const compiler = webpack({
        plugins: [
            new webpack.ProgressPlugin(),
        ],
        output: {
            path: config.dest
        },
        mode: 'development'
    });
    const modulerizr = new Modulerizr(config, compiler);

    modulerizr.log(`The rootPath is: ${config._rootPath}`);

    compiler.hooks.modulerizr_init = new AsyncSeriesHook(['modulerizr']);
    compiler.hooks.modulerizr_ready = new AsyncSeriesHook(['modulerizr']);
    compiler.hooks.modulerizr_render = new AsyncSeriesHook(['modulerizr']);
    compiler.hooks.afterRenderModulerizr = new AsyncSeriesHook(['compilation', 'modulerizr']);
    compiler.hooks.emitModulerizr = new AsyncSeriesHook(['compilation', 'modulerizr']);
    compiler.hooks.finishedModulerizr = new AsyncSeriesHook(['stats', 'modulerizr']);

    modulerizr.config.plugins.forEach(plugin => {
        plugin.apply(compiler, modulerizr);
    });

    compiler.hooks.emit.tapPromise('ExecuteModulerizrEmit', async(compilation) => {
        await compiler.hooks.emitModulerizr.promise(compilation, modulerizr);
    });
    compiler.hooks.afterCompile.tapPromise('ExecuteModulerizrBeforeCompile', async(compilation) => {
        await compiler.hooks.modulerizr_init.promise(modulerizr);
        await compiler.hooks.modulerizr_ready.promise(modulerizr);
        await compiler.hooks.modulerizr_render.promise(modulerizr);
        await compiler.hooks.afterRenderModulerizr.promise(compilation, modulerizr);
        await compiler.hooks.finishedModulerizr.promise(compilation, modulerizr);
    });

    return await compiler.run((err, stats) => { // Stats Object
        //console.log(err, stats)
        if (err)
            throw new Error('Something went wrong', err)

        console.log(color.green('Modulerizr finished'));
        return true
    });
}

exports.run = run;