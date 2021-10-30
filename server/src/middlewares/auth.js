const Joi = require('joi');

const registerValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .regex(/^[A-Za-z ,.'-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name includes invalid character.',
    }),

  email: Joi.string()
    .email()
    .min(3)
    .max(254)
    .lowercase()
    .required(),

  username: Joi.string()
    .min(1)
    .max(15)
    .lowercase()
    .regex(/^@?([a-z0-9_])*$/)
    .required()
    .messages({
      'string.pattern.base': 'Username should start with alphanumeric characters and can include underscore character.',
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    // Minimum eight characters, at least one letter, one number and one special character.
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&_.,][\S]*$/)
    .required()
    .messages({
      'string.pattern.base': 'Password should be at least 8 characters and contain at least one '
        + 'letter, one special character "@$!%*#?&_." and one integer.',
    }),

  bio: Joi.string(),
});

const loginValidationSchema = Joi.object({
  username: Joi.string()
    .min(1)
    .max(15)
    .lowercase()
    .regex(/^@?([a-z0-9_])*$/)
    .required()
    .messages({
      'string.pattern.base': 'Username should start with alphanumeric characters and can include underscore.',
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    // Minimum eight characters, at least one letter, one number and one special character.
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&_.,][\S]*$/)
    .required()
    .messages({
      'string.pattern.base': 'Password should be at least 8 characters and contain at least one '
        + 'letter, one special character "@$!%*#?&_." and one integer.',
    }),
});

const registerValidation = (req, res, next) => {
  const validation = registerValidationSchema.validate(req.body);
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

const loginValidation = (req, res, next) => {
  const validation = loginValidationSchema.validate(req.body);
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
