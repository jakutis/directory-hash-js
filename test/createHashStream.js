'use strict';

var lib = require('..');
var crypto = require('crypto');
var through2 = require('through2');

describe('createHashStream', function() {
  afterEach(calls.run);

  it('re-throws the error from boundary.createHash', function() {
    var boundary = new lib.Boundary();
    var error = id('error');
    var algorithm = id('algorithm');

    calls('boundary.createHash with the algorithm name', function() {
      this.createHashSpy = stub(boundary, 'createHash', function() {
        throw error;
      });
    }, function() {
      expect(this.createHashSpy)
        .to.have.been.calledWithExactly(algorithm);
    });

    expect(function() {
      lib.createHashStream(boundary, algorithm);
    }).to.throw(error);
    return Promise.resolve();
  });

  it('returns a stream that hashes', function() {
    var boundary = new lib.Boundary();
    var realAlgorithm = 'sha512';
    var algorithm = id('algorithm');

    calls('boundary.createHash with the algorithm name', function() {
      var createHash = boundary.createHash;
      this.createHashSpy = stub(boundary, 'createHash', function() {
        return createHash.call(boundary, realAlgorithm);
      });
    }, function() {
      expect(this.createHashSpy).to.have.been.calledOnce;
      expect(this.createHashSpy)
        .to.have.been.calledWithExactly(algorithm);
    });

    var buffer = new Buffer(id('buffer'));
    var stream = through2();
    stream.end(buffer);
    return Promise
      .resolve(lib.pumpAndConcat(boundary, [
        stream,
        lib.createHashStream(boundary, algorithm),
      ]))
      .then(function(result) {
        var hash = crypto.createHash(realAlgorithm);
        hash.update(buffer);
        hash = hash.digest();

        expect(result.toString('hex')).to.equal(hash.toString('hex'));
      });
  });
});
