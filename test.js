/* eslint-env jest */
/* eslint-disable node/no-unsupported-features */

'use strict';

const m = require('./');

const func = shouldError => {
  if (shouldError) {
    return cb => cb(new Error());
  }

  return cb => cb(null, 'yay');
};

test('promisified function resolves', async () => {
  const promisified = m(func());
  await expect(promisified()).resolves.toBeDefined();
});

test('promisified function rejects', async () => {
  const promisified = m(func(true));
  await expect(promisified()).rejects.toBeDefined();
});

test('promisified object resolve', async () => {
  const promisified = m({ someFunc: func() });
  await expect(promisified.someFunc()).resolves.toBeDefined();
});

test('promisified object rejects', async () => {
  const promisified = m({ someFunc: func(true) });
  await expect(promisified.someFunc()).rejects.toBeDefined();
});

test('successfully promisify fs', () => {
  expect(() => m(require('fs'))).not.toThrow();
});
