import { spawn } from 'child_process';
const EXIT_SUCCESS = 0;

describe('/lib/index.js', () => {
  const FILENAME = __dirname + '/../lib/index.js';

  it('can be invoked', () => {
    return new Promise(function (resolve, reject) {
      var dh = spawn(FILENAME);
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
