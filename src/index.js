const { run } = require('./index.run');
const { DebugPlugin } = require("modulerizr-webpack-plugin");

async function modulerizr() {
    return {
        run
    };
}

exports.modulerizr = modulerizr;
exports.DebugPlugin = DebugPlugin;
exports.run = run;