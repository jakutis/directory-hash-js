'use strict';

var createHashStream = require('./createHashStream');
var pumpAndConcat = require('./pumpAndConcat');

module.exports = function(boundary) {
  return Promise
    .bind({
      directory: boundary.argv[0],
    })
    .then(function() {
      return boundary.fs.readDirectory(this.directory);
    })
    .filter(function(file) {
      return file !== '.' && file !== '..';
    })
    .map(function(file) {
      var path = this.directory + '/' + file;
      var fileStream = boundary.fs.createReadStream(path);
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
