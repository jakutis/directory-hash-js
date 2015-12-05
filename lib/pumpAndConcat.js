'use strict';

var concatStream = require('concat-stream');

module.exports = function(boundary, streams) {
  return new Promise(function(resolve, reject) {
    boundary.pump(streams, concatStream(resolve), reject);
  });
};
