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

    return Object.keys(props).length > 0 ? Object.assign(obj.slice(), props) : obj;
  }

  const promisifiedObject = promisifyOwnProperties(obj);

  if (typeof obj === 'function') {
    const promisifiedFunction = promisify(obj);

    Object.assign(promisifiedFunction, promisifiedObject);

    return promisifiedFunction;
  }

  return promisifiedObject;
};
