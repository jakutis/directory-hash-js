'use strict';

var createHashStream = require('./createHashStream');
var pumpAndConcat = require('./pumpAndConcat');

module.exports = function(boundary) {
  var directory = boundary.argv[0];
  return Promise
    .bind({})
    .then(function() {
      return boundary.fs.readDirectory(directory);
    })
    .filter(function(file) {
      return file !== '.' && file !== '..';
    })
    .map(function(file) {
      var fileStream = boundary.fs.createReadStream(directory + '/' + file);
      var hashStream = createHashStream(boundary, 'sha512');
      return pumpAndConcat(fileStream, hashStream).then(function(hash) {
        return hash.toString('hex') + ' /' + file + '\n';
      });
    })
    .map(function(line) {
      boundary.stdout.write(new Buffer(line));
    })
    .then(function() {
      boundary.stdout.end();
    });
};
