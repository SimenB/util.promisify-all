'use strict';

const promisify = require('util.promisify');
const entries = require('object.entries');

const combiner = (acc, curr) => Object.assign(acc, curr);

function promisifyOwnProperties(obj) {
  return entries(obj)
    .map(entry => {
      if (typeof entry[1] === 'function') {
        return { [entry[0]]: promisify(entry[1]) };
      }

      return { [entry[0]]: entry[1] };
    })
    .reduce(combiner, {});
}

module.exports = obj => {
  if (!obj) {
    return obj;
  }

  if (typeof obj !== 'function' && typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    const props = promisifyOwnProperties(entries(obj).filter(e => obj.indexOf(e[1]) === -1).reduce(combiner, {}));

    if (Object.keys(props).length === 0) {
      return obj;
    }

    const newArray = obj.slice();
    entries(props).forEach(e => {
      const key = e[0];
      const value = e[1];

      Object.defineProperty(newArray, key, {
        enumerable: true,
        configurable: false,
        writable: true,
        value,
      });
    });

    return newArray;
  }

  const promisifiedObject = promisifyOwnProperties(obj);

  if (typeof obj === 'function') {
    const promisifiedFunction = promisify(obj);

    Object.assign(promisifiedFunction, promisifiedObject);

    return promisifiedFunction;
  }

  return promisifiedObject;
};
