function isObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function hasObjectKey(v) {
  return Object.keys(v).length;
}

function isValidMaxNumKey(v, max) {
  return Object.keys(v).length <= max;
}

module.exports = {
  isObject,
  hasObjectKey,
  isValidMaxNumKey,
};
