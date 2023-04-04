import { createErrorResponse } from '../common/knowzoneErrorHandler.js';

const checkAuthentication = (req, res, next) => {
  if (!('userId' in req.session)) {
    res.status(401).json(createErrorResponse('Access Denied.'));
  } else {
    next();
  }
};

export default checkAuthentication;
