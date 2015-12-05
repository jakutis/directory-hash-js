'use strict';

var through2 = require('through2');
var lib = require('..');

describe('pumpAndConcat', function() {
  it('rejects if pump results in an error', function() {
    return Promise
      .bind({})
      .then(function setup() {
        this.boundary = new lib.Boundary();
        this.error = new Error();

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
  it('works', function() {
    return Promise
      .bind({})
      .then(function setup() {
        this.buffer = new Buffer('beepboop\n', 'utf8');
        this.boundary = new lib.Boundary();

        var pump = this.boundary.pump;
        // Fake contract A.
        this.streams = {};
        this.pumpSpy = stub(this.boundary, 'pump', function(streams, _, __) {
          this.actualStreams = streams;

          var stream = through2();
          stream.end(this.buffer);
          return pump([stream], _, __);
        }.bind(this));
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
