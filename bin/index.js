#!/usr/bin/env node

const getConfig = require('./getConfig');
const modulerizr = require('../src/index');
const config = getConfig(process.argv);


modulerizr.run(config);