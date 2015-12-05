#!/usr/bin/env node

global._ = require('lodash');
global.Promise = require('bluebird');
var requireAll = require('require-all');
var lib = requireAll({
  dirname: __dirname + '/lib',
  recursive: true
});

if (require.main === module) {
  lib.run(new lib.Boundary()).catch(function (err) {
    process.stderr.write(err.stack + '\n');
    process.exit(1);
  });
} else {
  module.exports = lib;
}
