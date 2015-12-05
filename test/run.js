'use strict';

var lib = require('..');
var crypto = require('crypto');
var through2 = require('through2');

describe('run', function() {
  it('hashes a single file in directory', function() {
    return Promise
      .bind({
        boundary: new lib.Boundary(),
        directory: '/' + id('directory'),
        buffer: new Buffer(id('buffer'), 'utf8'),
        filename: id('filename'),
      })
      .then(function setup() {
        var self = this;

        // Fake contract C.
        this.boundary.argv = [this.directory];
        // Fake contract D.
        this.boundary.stdout = through2();

        var fs = this.boundary.fs;

        this.readDirectorySpy = stub(fs, 'readDirectory', function() {
          // Fake contract A.
          return Promise.resolve(['.', '..', self.filename]);
        });

        this.createReadStreamSpy = stub(fs, 'createReadStream', function() {
          // Fake contract B.
          var stream = through2();
          stream.end(self.buffer);
          return stream;
        });

        var shasum = crypto.createHash('sha512');
        shasum.update(self.buffer);
        this.hash = shasum.digest('hex');
      })
      .then(function exercise() {
        return lib.run(this.boundary);
      })
      .then(function verify() {
        return lib.pumpAndConcat(this.boundary, [this.boundary.stdout]);
      })
      .then(function verify(output) {
        // Check collaboration D.
        expect(output.toString('utf8'))
          .to.equal(this.hash + ' /' + this.filename + '\n');

        // Check collaborations B and C.
        expect(this.createReadStreamSpy).to.have.been.calledOnce;
        expect(this.createReadStreamSpy)
          .to.have.been.calledWithExactly(this.directory + '/' + this.filename);

        // Check collaborations A and C.
        expect(this.readDirectorySpy).to.have.been.calledOnce;
        expect(this.readDirectorySpy)
          .to.have.been.calledWithExactly(this.directory);
      });
  });
});
