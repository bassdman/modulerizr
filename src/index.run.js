const color = require('colors');
const webpack = require('webpack');
const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ModulerizrWebpackPlugin } = require('modulerizr-webpack-plugin');
const { foreachPromise } = require('modulerizr-webpack-plugin/utils');

async function run(_config) {
    let config = _config;

    if (!Array.isArray(config))
        config = [config];

    await foreachPromise(config, async conf => await runOne(conf));
}

async function runOne(config) {
    const compiler = webpack({
        plugins: [
            new webpack.ProgressPlugin(),
            new CleanWebpackPlugin(),
            new ModulerizrWebpackPlugin(config)
        ].concat(config.plugins || []),
        output: {
            path: config.dest || path.resolve(config._rootPath, "dest"),
        },
        mode: 'development'
    });

    return await compiler.run((err, stats) => { // Stats Object

        if (err) {
            console.log(err)
            throw new Error('Modulerizr failed.');
        }

        console.log(color.green('Modulerizr finished.'));
        return true
    });
}

exports.run = run;