'use strict';

var through2 = require('through2');

module.exports = function(boundary, algorithm) {
  var hash = boundary.createHash(algorithm);
  return through2(function(chunk, enc, cb) {
    hash.update(chunk);
    cb();
  }, function(cb) {
    this.push(hash.digest());
    cb();
  });
};
