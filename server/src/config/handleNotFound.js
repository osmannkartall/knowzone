import { createCustomError, KNOWZONE_ERROR_TYPES } from '../common/knowzoneErrorHandler.js';

// Do not remove the next parameter, otherwise the handleError function won't catch the error.
function handleNotFound(_req, _res, next) {
  next(createCustomError({
    description: 'Not Found',
    statusCode: 404,
    type: KNOWZONE_ERROR_TYPES.NOT_FOUND,
  }));
}

export default handleNotFound;
