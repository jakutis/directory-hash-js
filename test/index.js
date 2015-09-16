import * as dh from '..';
import * as assert from 'assert';
import * as Promise from 'bluebird';

describe('CLI', () => {
  it('is a function', () => {
    return Promise
      .try(function () {
        assert.equal(typeof dh.CLI, 'function');
      });
  });
});
