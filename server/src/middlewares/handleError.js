const { createErrorResponse, isApiSchemaError } = require('../knowzoneErrorHandler');

// Do not remove the next parameter, otherwise the handleError function won't catch the error.
function handleError(err, _req, res, next) {
  let statusCode = 500;
  let description = 'An error occured';

  if (isApiSchemaError(err)) {
    statusCode = 400;
    description = err.details[0].message;
  } else if (err.statusCode && err.description) {
    statusCode = err.statusCode;
    description = err.description;
  }

  console.error('type:', err.type);
  console.error('statusCode:', err.statusCode);
  console.error('description:', err.description);

  if (err.data) {
    console.error('data:', err.data);
  }

  console.error(err.stack);

  res.status(statusCode).json(createErrorResponse(description));
}

module.exports.handleError = handleError;
