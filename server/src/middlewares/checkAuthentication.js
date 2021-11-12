const { createErrorResponse } = require('../knowzoneErrorHandler');

const checkAuthentication = (req, res, next) => {
  if (!('userId' in req.session)) {
    res.status(401).json(createErrorResponse('Access Denied.'));
  } else {
    next();
  }
};

module.exports.checkAuthentication = checkAuthentication;
