'use strict';

var crypto = require('crypto');
var fs = Promise.promisifyAll(require('fs'));
var through2 = require('through2');
var pump = require('pump');

function Boundary() {
}

Boundary.prototype = {
  pump: function(streams, finalStream, errorHandler) {
    var pumpArguments = streams.slice();
    pumpArguments.push(finalStream);
    pumpArguments.push(errorHandler);
    pump.apply(null, pumpArguments);
  },
  createHash: crypto.createHash,
  stdout: through2(function(chunk, enc, cb) {
    process.stdout.write(chunk, enc, cb);
  }),
  argv: process.argv.slice(),
  fs: {
    readDirectory: fs.readdirAsync.bind(fs),
    createReadStream: fs.createReadStream.bind(fs),
  },
};
Boundary.prototype.argv.shift();
Boundary.prototype.argv.shift();

module.exports = Boundary;
