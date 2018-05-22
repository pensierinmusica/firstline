'use strict';

const fs = require('fs');

const defOpts = {
  encoding: 'utf8',
  lineEnding: '\n'
};

module.exports = (path, opts = defOpts) => {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(path, {encoding: opts.encoding});
    let acc = '';
    let pos = 0;
    let index;
    rs
      .on('data', chunk => {
        index = chunk.indexOf(opts.lineEnding);
        acc += chunk;
        if (index === -1) {
          pos += chunk.length;
        } else {
          pos += index;
          rs.close();
        }
      })
      .on('close', () => resolve(acc.slice(acc.charCodeAt(0) === 0xFEFF ? 1 : 0, pos)))
      .on('error', err => reject(err));
  });
};
