'use strict';

var through2 = require('through2');
var lib = require('..');

describe('pumpAndConcat', function() {
  it('rejects if pump results in an error', function() {
    return Promise
      .bind({
        boundary: new lib.Boundary(),
        error: new Error(),
      })
      .then(function setup() {
        // Fake contract A.
        stub(this.boundary, 'pump', function(_, __, reject) {
          setTimeout(function() {
            reject(this.error);
          }.bind(this));
        }.bind(this));
      })
      .then(function exerciseAndVerify() {
        var promise = lib.pumpAndConcat(this.boundary, []);

        // Check collaboration A.
        return expect(promise).to.eventually.be.rejectedWith(this.error);
      });
  });
  it('pumps streams and resolves with a concatenated buffer', function() {
    return Promise
      .bind({
        boundary: new lib.Boundary(),
        buffer: new Buffer(str('buffer'), 'utf8'),
        streams: str('streams'),
      })
      .then(function setup() {
        var self = this;

        // Fake contract A.
        var pump = this.boundary.pump;
        this.pumpSpy = stub(this.boundary, 'pump', function(streams, _, __) {
          self.actualStreams = streams;

          var stream = through2();
          stream.end(self.buffer);
          pump([stream], _, __);
        });
      })
      .then(function exercise() {
        return lib.pumpAndConcat(this.boundary, this.streams);
      })
      .then(function verify(result) {
        expect(result.toString('hex')).to.equal(this.buffer.toString('hex'));

        // Check collaboration A.
        expect(this.pumpSpy).to.have.been.calledOnce;
        expect(this.actualStreams).to.equal(this.streams);
      });
  });
});
