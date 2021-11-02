const KNOWZONE_ERROR_TYPES = Object.freeze({
  AUTH: 'AUTH',
  POST: 'POST',
  SEARCH: 'SEARCH',
});

class KnowzoneError extends Error {
  constructor({ type, code, description, stack, ...rest }) {
    super(description);

    this.type = type;
    this.code = code;
    this.description = description;
    this.stack = stack;
    this.data = rest;

    Object.setPrototypeOf(this, KnowzoneError.prototype);
  }
}

function createResponse(status, message) {
  return { status, message };
}

// Do not remove next parameter otherwise error-handler middleware cannot catch the error.
function handleError(err, _req, res, next) {
  console.log('type:', err.type, ', code:', err.code, ', description:', err.description);
  console.log('data:', err.data);

  console.error('STACK TRACE');
  console.error(err.stack);

  res.status(500).json(createResponse('error', err.description));
}

module.exports = {
  KNOWZONE_ERROR_TYPES,
  KnowzoneError,
  handleError,
  createResponse,
};
