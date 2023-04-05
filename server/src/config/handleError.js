import {
  createErrorResponse,
  isApiSchemaError,
  isCustomError,
  isMulterError,
  isSchemaError,
  isMongoError,
  setMongoErrorDescription,
} from '../common/knowzoneErrorHandler.js';

function getCustomFieldsByErrorType(err) {
  let statusCode = 500;
  let description = 'An error occurred';

  // The order of check is important.
  if (isSchemaError(err)) {
    statusCode = 400;
    description = err.message;
  } else if (isMongoError(err)) {
    description = setMongoErrorDescription(err);
  } else if (isMulterError(err)) {
    description = err.message;
  } else if (isApiSchemaError(err)) {
    statusCode = 400;
    description = err.details[0].message;
  } else if (isCustomError(err)) {
    statusCode = err.statusCode;
    description = err.description;
  }

  return { statusCode, description };
}

function logError(err, statusCode, description) {
  console.error('type:', err.type);
  console.error('statusCode:', statusCode);
  console.error('description:', description);

  if (err.data) {
    console.error('data:', err.data);
  }

  console.error(err.stack);
}

// Do not remove the next parameter, otherwise the handleError function won't catch the error.
function handleError(err, _req, res, next) {
  const { statusCode, description } = getCustomFieldsByErrorType(err);

  logError(err, statusCode, description);

  res.status(statusCode).json(createErrorResponse(description));
}

export default handleError;
