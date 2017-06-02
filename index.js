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

module.exports = obj => {
  if (!obj) {
    return obj;
  }

  const typeOfObj = typeof obj;

  if (typeOfObj !== 'function' && (typeOfObj !== 'object' || Array.isArray(obj))) {
    return obj;
  }

  const promisifiedObject = promisifyOwnProperties(obj);

  if (typeOfObj === 'function') {
    const promisifiedFunction = promisify(obj);

    Object.assign(promisifiedFunction, promisifiedObject);

    return promisifiedFunction;
  }

  return promisifiedObject;
};
