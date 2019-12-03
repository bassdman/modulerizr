#!/usr/bin/env node

const path = require('path');
const getConfig = require('./getConfig');

const config = getConfig(process.argv);
require('../src/index')(config);