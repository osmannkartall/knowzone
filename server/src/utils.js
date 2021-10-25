function isLengthBetween(items, max, min = 0) {
  return items && items.length >= min && items.length <= max;
}

function maxLengthMessage(len) {
  return `Received value longer than maximum allowed length(${len}).`;
}

function transformToJSON(schema) {
  schema.set('toJSON', {
    transform(_, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  });
}

function isArrayUnique(arr) {
  return arr.every((a, i) => arr.indexOf(a) === i);
}

module.exports = {
  isLengthBetween,
  maxLengthMessage,
  transformToJSON,
  isArrayUnique,
};
