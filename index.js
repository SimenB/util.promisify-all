'use strict';

const promisify = require('util.promisify');
const entries = require('object.entries');

module.exports = obj => {
  if (typeof obj === 'function') {
    return promisify(obj);
  }

  return entries(obj)
    .map(entry => ({ [entry[0]]: promisify(entry[1]) }))
    .reduce((acc, curr) => Object.assign(acc, curr), {});
};
