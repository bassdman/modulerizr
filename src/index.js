const { run } = require('./index.run');
async function modulerizr() {
    return {
        run
    };
}

exports.modulerizr = modulerizr;
exports.run = run;