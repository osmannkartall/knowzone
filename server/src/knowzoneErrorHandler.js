const KNOWZONE_ERROR_TYPES = Object.freeze({
  AUTH: 'AUTH',
  POST: 'POST',
  SEARCH: 'SEARCH',
  NOT_FOUND: 'NOT FOUND',
});

function isApiSchemaError(err) {
  return err && Array.isArray(err.details) && err.details[0] && err.details[0].message;
}

function hasLowerLayerCustomError(err) {
  return err && err.type && err.type in KNOWZONE_ERROR_TYPES && err.statusCode && err.description;
}

function setRequiredErrorFields(err, customFields) {
  err.description = customFields.description;
  err.statusCode = customFields.statusCode;
  err.type = customFields.type;
}

function setOptionalErrorFields(err, customFields) {
  if (customFields.data) {
    err.data = customFields.data;
  }
}

function changeToCustomError(err, customFields) {
  if (customFields) {
    setRequiredErrorFields(err, customFields);
    setOptionalErrorFields(err, customFields);
  }
}

function createCustomError(customFields) {
  const err = new Error();

  changeToCustomError(err, customFields);

  return err;
}

function createErrorResponse(message) {
  return { status: 'fail', message };
}

module.exports = {
  KNOWZONE_ERROR_TYPES,
  isApiSchemaError,
  hasLowerLayerCustomError,
  changeToCustomError,
  createCustomError,
  createErrorResponse,
};
