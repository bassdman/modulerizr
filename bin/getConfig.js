const path = require('path');
const fs = require('fs-extra');

module.exports = function(argv) {
    const rootpath = path.join(argv[1], '../../../');
    let config;
    try {
        config = require(path.join(rootpath, 'modulerizr.config.js'));
    } catch (e) {
        try {
            config = fs.readJSONSync(path.join(rootpath, 'modulerizr.config.json'));
        } catch (e) {
            throw new Error('no modulerizr.config.js or modulerizr.config.json found');
        }

    }

    for (let arg of process.argv) {
        switch (arg) {
            case '--debug':
                config.debug = true;
                break;
            case '--production':
                config.debug = false;
                break;
        }
    }

    config._rootPath = rootpath;
    return config;
}