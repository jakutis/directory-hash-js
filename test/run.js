'use strict';

var lib = require('..');
var crypto = require('crypto');
var through2 = require('through2');

describe('run', function() {
  afterEach(calls.run);

  it('hashes a single file in directory', function() {
    var boundary = new lib.Boundary();
    var directory = '/' + id('directory');
    var buffer = new Buffer(id('buffer'), 'utf8');
    var filename = id('filename');

    calls('boundary.fs.createReadStream', function() {
      var fs = boundary.fs;
      this.createReadStreamSpy = stub(fs, 'createReadStream', function() {
        var stream = through2();
        stream.end(buffer);
        return stream;
      });
    }, function() {
      expect(this.createReadStreamSpy).to.have.been.calledOnce;
      expect(this.createReadStreamSpy)
        .to.have.been.calledWithExactly(directory + '/' + filename);
    });

    calls('boundary.fs.readDirectory', function() {
      this.readDirectorySpy = stub(boundary.fs, 'readDirectory', function() {
        return Promise.resolve(['.', '..', filename]);
      });
    }, function() {
      expect(this.readDirectorySpy).to.have.been.calledOnce;
      expect(this.readDirectorySpy)
        .to.have.been.calledWithExactly(directory);
    });

    boundary.argv = [directory];
    boundary.stdout = through2();

    return Promise
      .resolve(lib.run(boundary))
      .then(function() {
        return lib.pumpAndConcat(boundary, [boundary.stdout]);
      })
      .then(function(output) {
        var hash = crypto.createHash('sha512');
        hash.update(buffer);
        hash = hash.digest('hex');

        expect(output.toString('utf8'))
          .to.equal(hash + ' /' + filename + '\n');
      });
  });
});
