'use strict';

var lib = require('..');
var crypto = require('crypto');
var through2 = require('through2');

describe('createHashStream', function() {
  it('works', function() {
    return Promise
      .bind({
        buffer: new Buffer('beep' + Math.random()),
        realAlgorithm: 'sha512',
        algorithm: 'abc' + Math.random(),
      })
      .then(function setup() {
        var self = this;

        this.stream = through2();
        this.stream.end(this.buffer);

        var hash = crypto.createHash(this.realAlgorithm);
        hash.update(this.buffer);
        this.hash = hash.digest();

        this.boundary = new lib.Boundary();
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
