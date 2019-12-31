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

async function runOne(_config) {
    const config = Object.assign({}, {
        dest: path.resolve(_config._rootPath, "dest"),
        defaultComponentWrapper: "div",
        maxRecursionLevel: 100
    }, _config);

    const compiler = webpack({
        plugins: [
            new webpack.ProgressPlugin(),
            new CleanWebpackPlugin(),
            new ModulerizrWebpackPlugin(_config)
        ],
        output: {
            path: config.dest
        },
        mode: 'development'
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