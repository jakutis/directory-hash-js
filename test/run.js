'use strict';

var lib = require('..');
var crypto = require('crypto');
var through2 = require('through2');

describe('run', function() {
  it('hashes a single file in directory', function() {
    return Promise
      .bind({})
      .then(function setup() {
        this.directory = '/directory';

        this.boundary = new lib.Boundary();
        this.boundary.argv = [this.directory];
        this.boundary.stdout = through2();

        var buffer = new Buffer('abc\n', 'utf8');
        var fs = this.boundary.fs;

        this.readDirectorySpy = stub(fs, 'readDirectory', function() {
          return Promise.resolve(['.', '..', 'def']);
        });

        this.createReadStreamSpy = stub(fs, 'createReadStream', function() {
          var stream = through2();
          stream.end(buffer);
          return stream;
        });

        var shasum = crypto.createHash('sha512');
        shasum.update(buffer);
        this.hash = shasum.digest('hex');
      })
      .then(function exercise() {
        return lib.run(this.boundary);
      })
      .then(function() {
        return lib.pumpAndConcat(this.boundary.stdout);
      })
      .then(function verify(output) {
        expect(output.toString('utf8'))
          .to.equal(this.hash + ' /def\n');

        expect(this.createReadStreamSpy)
          .to.have.been.calledWithExactly(this.directory + '/def');

        expect(this.readDirectorySpy)
          .to.have.been.calledWithExactly(this.directory);
      });
  });
});
