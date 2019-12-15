const { run } = require('./index.run');
const { DebugPlugin } = require("./plugins/DebugPlugin");

async function modulerizr() {
    return {
        run
    };
}

exports.modulerizr = modulerizr;
exports.DebugPlugin = DebugPlugin;
exports.run = run;