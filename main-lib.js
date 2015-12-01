#!/usr/bin/env node

global._ = require('lodash');
global.Promise = require('bluebird');

if (require.main === module) {
  require('./lib/bin');
} else {
  require('./lib/main');
}
