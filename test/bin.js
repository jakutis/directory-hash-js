import { spawn } from 'child_process';
const EXIT_SUCCESS = 0;
const BIN_FILENAME = __dirname + '/../lib/index.js';

describe('bin', () => {
  it('can be invoked', () => {
    return new Promise(function (resolve, reject) {
      var dh = spawn(BIN_FILENAME);
      dh.on('exit', function (code) {
        if (code === EXIT_SUCCESS) {
          resolve();
        } else {
          reject(new Error('exited with error code: ' + code));
        }
      });
    });
  });
});
