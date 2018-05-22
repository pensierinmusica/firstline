'use strict';

const fs = require('fs');

module.exports = (path, lineEnding = '\n') => {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(path, {encoding: 'utf8'});
    let acc = '';
    let pos = 0;
    let index;
    rs
      .on('data', chunk => {
        index = chunk.indexOf(lineEnding);
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
