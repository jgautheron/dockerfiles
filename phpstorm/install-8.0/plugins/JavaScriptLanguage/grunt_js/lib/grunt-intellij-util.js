var toString = {}.toString;

function isString(value) {
  return typeof value === 'string' || toString.call(value) === '[object String]';
}

function isObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

exports.isString = isString;
exports.isObject = isObject;
