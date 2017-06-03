'use strict';

const promisify = require('util.promisify');
const entries = require('object.entries');

function promisifyOwnProperties(obj) {
  return entries(obj)
    .map(entry => {
      if (typeof entry[1] === 'function') {
        return { [entry[0]]: promisify(entry[1]) };
      }

      return { [entry[0]]: entry[1] };
    })
    .reduce((acc, curr) => Object.assign(acc, curr), {});
}

function handleArray(arr) {
  let numberOfPromisifictions = 0;

  const promisifictions = arr.map(e => {
    if (typeof e === 'function') {
      numberOfPromisifictions++;

      return promisify(e);
    }

    return e;
  });

  if (numberOfPromisifictions > 0) {
    return promisifictions;
  }

  return arr;
}

module.exports = obj => {
  if (!obj) {
    return obj;
  }

  if (typeof obj !== 'function' && typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return handleArray(obj);
  }

  const promisifiedObject = promisifyOwnProperties(obj);

  if (typeof obj === 'function') {
    const promisifiedFunction = promisify(obj);

    Object.assign(promisifiedFunction, promisifiedObject);

    return promisifiedFunction;
  }

  return promisifiedObject;
};
