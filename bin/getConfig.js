const path = require('path');
const fs = require('fs-extra');

module.exports = function(argv) {
    const rootpath = path.join(argv[1], '../../../');
    let config;
    try {
        config = require(path.join(path.resolve(), 'modulerizr.config.js'));

    } catch (e) {
        console.error(e)
        throw new Error('No modulerizr.config.js found. Or there is an error in the file.');
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