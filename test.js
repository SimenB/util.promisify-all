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
  expect(() => m(require('fs'))).not.toThrow();
});

test('successfully promisifies function with properties', () => {
  const promisified = m(require('./fixtures/function-property'));
  return Promise.all([
    expect(promisified()).resolves.toEqual('foo'),
    expect(promisified.bar()).resolves.toEqual('bar'),
  ]);
});

test('leave primitives alone', () => {
  const number = 1;
  const boolean = true;
  const string = 'string';
  const nullVar = null;
  const undefinedVar = undefined;
  const symbol = Symbol('some symbol');

  expect(m(number)).toBe(number);
  expect(m(boolean)).toBe(boolean);
  expect(m(string)).toBe(string);
  expect(m(nullVar)).toBe(nullVar);
  expect(m(undefinedVar)).toBe(undefinedVar);
  expect(m(symbol)).toBe(symbol);
});

test('promisify array properties', () => {
  const array = [true, 'sup', func()];
  array.bar = func();

  expect(m(array)).not.toBe(array);
  return expect(m(array).bar()).resolves.toBeDefined();
});

test('return same array if no promisification', () => {
  const array = [true, 'sup', func()];

  expect(m(array)).toBe(array);
});
