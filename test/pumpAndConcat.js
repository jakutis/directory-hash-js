'use strict';

var through2 = require('through2');
var lib = require('..');

describe('pumpAndConcat', function() {
  it('works', function() {
    return Promise
      .bind({})
      .then(function setup() {
        this.buffer = new Buffer('beepboop\n', 'utf8');
        this.stream = through2();
        this.stream.end(this.buffer);
      })
      .then(function exercise() {
        return lib.pumpAndConcat(this.stream);
      })
      .then(function verify(result) {
        expect(result.equals(this.buffer)).to.equal(true);
      });
  });
});
