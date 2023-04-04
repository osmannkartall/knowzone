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

function createSuccessResponse(message) {
  return { status: 'success', message };
}

function isObjectEmpty(obj) {
  return obj === undefined
    || obj === null
    || Object.keys(obj).length === 0;
}

export {
  transformToJSON,
  isArrayUnique,
  createSuccessResponse,
  isObjectEmpty,
};
