const { foreachPromise } = require('./utils');
const { Modulerizr } = require('./Modulerizr');
const color = require('colors');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack'); //to access built-in plugins
const { AsyncSeriesHook, SyncHook } = require('tapable');

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
            new CleanWebpackPlugin(),
        ],
        output: {
            path: config.dest
        },
        mode: 'development'
    });

    compiler.hooks.modulerizrInit = new AsyncSeriesHook(['modulerizr']);
    compiler.hooks.modulerizrReady = new AsyncSeriesHook(['modulerizr']);
    compiler.hooks.modulerizrRender = new AsyncSeriesHook(['modulerizr']);
    compiler.hooks.modulerizrAfterRender = new AsyncSeriesHook(['modulerizr']);
    compiler.hooks.compilationModulerizr = new SyncHook(['modulerizr']);

    compiler.hooks.emitModulerizr = new AsyncSeriesHook(['compilation', 'modulerizr']);
    compiler.hooks.finishedModulerizr = new AsyncSeriesHook(['stats', 'modulerizr']);




    const modulerizr = new Modulerizr(config, compiler);

    modulerizr.log(`The rootPath is: ${config._rootPath}`);

    modulerizr.config.plugins.forEach(plugin => {
        plugin.apply(compiler);
    });

    await compiler.hooks.modulerizrInit.promise(modulerizr);
    await compiler.hooks.modulerizrReady.promise(modulerizr);
    await compiler.hooks.modulerizrRender.promise(modulerizr);
    await compiler.hooks.modulerizrAfterRender.promise(modulerizr);
    await compiler.hooks.finishedModulerizr.promise(modulerizr);

    compiler.hooks.emit.tapPromise('ExecuteModulerizrEmit', async(compilation) => {
        await compiler.hooks.emitModulerizr.promise(compilation, modulerizr);
    });
    compiler.hooks.compilation.tap('ExecuteModulerizrCompilation', (compilation, compilationParams) => {
        compiler.hooks.compilationModulerizr.call(compilation, compilationParams, modulerizr);
    });

    return await compiler.run((err, stats) => { // Stats Object
        //console.log(err, stats)
        if (err)
            throw new Error(err)

        console.log(color.green('Modulerizr finished'));
        return true
    });
}

exports.run = run;