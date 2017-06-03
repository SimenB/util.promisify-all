/* eslint-env jest */

'use strict';

const m = require('./');

const func = shouldError => {
  if (shouldError) {
    return cb => cb(new Error());
  }

  return cb => cb(null, 'yay');
};

test('promisified function resolves', () => {
  const promisified = m(func());
  return expect(promisified()).resolves.toBeDefined();
});

test('promisified function rejects', () => {
  const promisified = m(func(true));
  return expect(promisified()).rejects.toBeDefined();
});

test('promisified object resolve', () => {
  const promisified = m({ someFunc: func() });
  return expect(promisified.someFunc()).resolves.toBeDefined();
});

test('promisified object rejects', () => {
  const promisified = m({ someFunc: func(true) });
  return expect(promisified.someFunc()).rejects.toBeDefined();
});

test('successfully promisify fs', () => {
  const fs = m(require('fs'));
  expect(fs.stat(__dirname).then(stat => stat.isDirectory())).resolves.toEqual(true);
});

test('successfully promisifies function with properties', () => {
  const promisified = m(require('./fixtures/function-property'));
  return Promise.all([
    expect(promisified()).resolves.toEqual('foo'),
    expect(promisified.bar()).resolves.toEqual('bar'),
  ]);
});
