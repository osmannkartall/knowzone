const { createErrorResponse } = require('../utils');

const KNOWZONE_ERROR_TYPES = Object.freeze({
  AUTH: 'AUTH',
  POST: 'POST',
  SEARCH: 'SEARCH',
  NOT_FOUND: 'NOT FOUND',
});

// Do not remove the next parameter, otherwise the handleError function won't catch the error.
function handleError(err, _req, res, next) {
  console.error('type:', err.type);
  console.error('code:', err.code);
  console.error('description:', err.description);
  console.error('data:', err.data);

  if (err.stack) {
    console.error(err.stack);
  }

  const code = err.code ? err.code : 500;
  const description = err.description ? err.description : 'Error when handling request';

  res.status(code).json(createErrorResponse(description));
}

module.exports = {
  KNOWZONE_ERROR_TYPES,
  handleError,
};
