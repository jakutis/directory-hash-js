'use strict';

var lib = require('..');
var crypto = require('crypto');
var through2 = require('through2');

describe('createHashStream', function() {
  it('works', function() {
    return Promise
      .bind({})
      .then(function setup() {
        this.stream = through2();
        this.stream.end('beepboop\n');

        var hash = crypto.createHash('sha512');
        hash.update(new Buffer('beepboop\n'));
        this.hash = hash.digest();

        this.boundary = new lib.Boundary();
        var createHash = this.boundary.createHash;
        this.createHashSpy = stub(this.boundary, 'createHash', function() {
          // Execute contract A.
          return createHash.call(this, 'sha512');
        });
        this.hashStream = lib.createHashStream(this.boundary, 'abcdef');
      })
      .then(function exercise() {
        return lib.pumpAndConcat(this.boundary, [this.stream, this.hashStream]);
      })
      .then(function verify(result) {
        expect(result.toString('hex')).to.equal(this.hash.toString('hex'));
        // Check collaboration A.
        expect(this.createHashSpy).to.have.been.calledOnce;
        expect(this.createHashSpy).to.have.been.calledWithExactly('abcdef');
      });
  });
});
