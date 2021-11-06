const registerValidation = (registerApiSchema) => (req, res, next) => {
  const validation = registerApiSchema.validate(req.body);
  if ('error' in validation) {
    const { error } = validation;
    res.status(400).json({
      status: 'fail',
      message: error.details[0].message,
    });
  } else {
    next();
  }
};

const loginValidation = (loginApiSchema) => (req, res, next) => {
  const validation = loginApiSchema.validate(req.body);

  if ('error' in validation) {
    const { error } = validation;
    res.status(400).json({
      status: 'fail',
      message: error.details[0].message,
    });
  } else {
    next();
  }
};

const checkAuthentication = (req, res, next) => {
  if (!('userId' in req.session)) {
    res.status(401).json({
      status: 'fail',
      message: 'Access Denied.',
    });
  } else {
    next();
  }
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.checkAuthentication = checkAuthentication;
