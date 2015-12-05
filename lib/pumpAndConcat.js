'use strict';

var pump = require('pump');
var concatStream = require('concat-stream');

module.exports = function() {
  var pumpArguments = [].slice.call(arguments);
  return new Promise(function(resolve, reject) {
    pumpArguments.push(concatStream(resolve));
    pumpArguments.push(reject);
    pump.apply(null, pumpArguments);
  });
};
