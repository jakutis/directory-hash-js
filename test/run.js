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
        // Fake contract C.
        this.boundary.argv = [this.directory];
        // Fake contract D.
        this.boundary.stdout = through2();

        var buffer = new Buffer('abc\n', 'utf8');
        var fs = this.boundary.fs;

        this.readDirectorySpy = stub(fs, 'readDirectory', function() {
          // Fake contract A.
          return Promise.resolve(['.', '..', 'def']);
        });

        this.createReadStreamSpy = stub(fs, 'createReadStream', function() {
          // Fake contract B.
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
        return lib.pumpAndConcat(this.boundary, [this.boundary.stdout]);
      })
      .then(function verify(output) {
        // Check collaboration D.
        expect(output.toString('utf8'))
          .to.equal(this.hash + ' /def\n');

        // Check collaborations B and C.
        expect(this.createReadStreamSpy).to.have.been.calledOnce;
        expect(this.createReadStreamSpy)
          .to.have.been.calledWithExactly(this.directory + '/def');

        // Check collaborations A and C.
        expect(this.readDirectorySpy).to.have.been.calledOnce;
        expect(this.readDirectorySpy)
          .to.have.been.calledWithExactly(this.directory);
      });
  });
});
