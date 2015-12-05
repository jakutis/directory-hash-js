'use strict';

var through2 = require('through2');
var lib = require('..');

describe('pumpAndConcat', function() {
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
