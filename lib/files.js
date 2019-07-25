const fs = require('fs');
const { promisify } = require('util');

module.exports = {
  readFile: promisify(fs.readFile),
  appendFile: promisify(fs.appendFile)
};
