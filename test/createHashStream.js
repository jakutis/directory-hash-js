'use strict';

var lib = require('..');
var crypto = require('crypto');
var through2 = require('through2');

describe('createHashStream', function() {
  it('re-throws the error from boundary.createHash', function() {
    return Promise
      .bind({
        boundary: new lib.Boundary(),
        error: str('error'),
      })
      .then(function setup() {
        var self = this;

        // Fake contract A.
        stub(this.boundary, 'createHash', function() {
          throw self.error;
        });
      })
      .then(function exerciseAndVerify() {
        var self = this;
        expect(function() {
          lib.createHashStream(self.boundary);
        }).to.throw(this.error);
      });
  });
  it('returns a stream that transforms using boundary.createHash', function() {
    return Promise
      .bind({
        buffer: new Buffer(str('buffer')),
        realAlgorithm: 'sha512',
        algorithm: str('algorithm'),
        boundary: new lib.Boundary(),
        stream: through2(),
      })
      .then(function setup() {
        var self = this;

        this.stream.end(this.buffer);

        var hash = crypto.createHash(this.realAlgorithm);
        hash.update(this.buffer);
        this.hash = hash.digest();

        var createHash = this.boundary.createHash;
        this.createHashSpy = stub(this.boundary, 'createHash', function() {
          // Execute contract A.
          return createHash.call(this, self.realAlgorithm);
        });
      })
      .then(function exercise() {
        this.hashStream = lib.createHashStream(this.boundary, this.algorithm);
      })
      .then(function verify(result) {
        return lib.pumpAndConcat(this.boundary, [this.stream, this.hashStream]);
      })
      .then(function verify(result) {
        expect(result.toString('hex')).to.equal(this.hash.toString('hex'));

        // Check collaboration A.
        expect(this.createHashSpy).to.have.been.calledOnce;
        expect(this.createHashSpy)
          .to.have.been.calledWithExactly(this.algorithm);
      });
  });
});
