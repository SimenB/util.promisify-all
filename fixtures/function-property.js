'use strict';

function foo(callback) {
  callback(null, 'foo');
}
foo.bar = function bar(callback) {
  callback(null, 'bar');
};
module.exports = foo;
