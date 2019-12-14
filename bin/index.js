#!/usr/bin/env node

const getConfig = require('./getConfig');
const modulerizr = require('../src/index');
const color = require('colors');
const config = getConfig(process.argv);

const action = process.argv[2] || 'run';

switch (action) {
    case "run":
        modulerizr.run(config);
        break;
    default:
        throw color.red(`Unknown command "modulerizr ${action}". You can run one of the following commands:
    - "modulerizr run"
`);
}