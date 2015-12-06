'use strict';

var through2 = require('through2');
var lib = require('..');

describe('pumpAndConcat', function() {
  afterEach(calls.run);

  it('rejects if pump results in an error', function() {
    var boundary = new lib.Boundary();
    var error = id('error');

    stub(boundary, 'pump', function(_, __, reject) {
      setTimeout(function() {
        reject(error);
      });
    });

    return expect(lib.pumpAndConcat(boundary, []))
      .to.eventually.be.rejectedWith(error);
  });

  it('pumps streams and resolves with a concatenated buffer', function() {
    var boundary = new lib.Boundary();
    var buffer = new Buffer(id('buffer'), 'utf8');
    var streams = id('streams');

    calls('boundary.pump once with the streams', function() {
      var pump = boundary.pump;
      this.pumpSpy = stub(boundary, 'pump', function(streams, _, __) {
        this.actualStreams = streams;

        var stream = through2();
        stream.end(buffer);
        pump([stream], _, __);
      }.bind(this));
    }, function() {
      expect(this.pumpSpy).to.have.been.calledOnce;
      expect(this.actualStreams).to.equal(streams);
    });

    var promise = lib.pumpAndConcat(boundary, streams);
    return promise.then(function(result) {
      expect(result.toString('hex'))
        .to.equal(buffer.toString('hex'));
    });
  });
});
