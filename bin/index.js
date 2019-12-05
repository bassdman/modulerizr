#!/usr/bin/env node

const getConfig = require('./getConfig');

const config = getConfig(process.argv);
require('../src/index')(config);