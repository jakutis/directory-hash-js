'use strict';

var lib = require('..');
var crypto = require('crypto');
var through2 = require('through2');

var points = {
  _pending: [],
  _collaborations: [],
  contract: function(names, fn) {
    this._pending = this._pending.concat(names);
    fn();
  },
  collaboration: function(names, fn) {
    this._collaborations.push(function() {
      this._pending = _.difference(this._pending, [].concat(names));
      return fn();
    }.bind(this));
  },
  verify: function() {
    var self = this;
    return Promise
      .map(self._collaborations, function(collaboration) {
        return collaboration();
      })
      .then(function() {
        expect(self._pending).to.eql([]);
      });
  },
};
_.bindAll(points);

describe('run', function() {
  it('hashes a single file in directory', function() {
    return Promise
      .bind({
        boundary: new lib.Boundary(),
        directory: '/' + id('directory'),
        buffer: new Buffer(id('buffer'), 'utf8'),
        filename: id('filename'),
      })
      .then(function setup() {
        var self = this;

        points.contract('D', function() {
          self.boundary.stdout = through2();
        });

        points.collaboration('D', function() {
          var output = lib.pumpAndConcat(self.boundary, [self.boundary.stdout]);
          return Promise
            .resolve(output)
            .then(function(output) {
              self.output = output.toString('utf8');
            });
        });

        points.contract('C', function() {
          self.boundary.argv = [self.directory];
        });

        points.contract('A', function() {
          var fs = self.boundary.fs;
          self.readDirectorySpy = stub(fs, 'readDirectory', function() {
            return Promise.resolve(['.', '..', self.filename]);
          });
        });

        points.collaboration(['A', 'C'], function() {
          expect(self.readDirectorySpy).to.have.been.calledOnce;
          expect(self.readDirectorySpy)
            .to.have.been.calledWithExactly(self.directory);
        });

        points.contract('B', function() {
          var fs = self.boundary.fs;
          self.createReadStreamSpy = stub(fs, 'createReadStream', function() {
            var stream = through2();
            stream.end(self.buffer);
            return stream;
          });
        });

        points.collaboration(['B', 'C'], function() {
          var path = self.directory + '/' + self.filename;

          expect(self.createReadStreamSpy).to.have.been.calledOnce;
          expect(self.createReadStreamSpy)
            .to.have.been.calledWithExactly(path);
        });

        var shasum = crypto.createHash('sha512');
        shasum.update(self.buffer);
        this.hash = shasum.digest('hex');
      })
      .then(function exercise() {
        return lib.run(this.boundary);
      })
      .then(points.verify)
      .then(function verify() {
        expect(this.output).to.equal(this.hash + ' /' + this.filename + '\n');
      });
  });
});
