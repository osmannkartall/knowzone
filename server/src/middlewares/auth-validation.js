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
    .min(3)
    .max(50)
    .lowercase()
    // Username should start with alphanumeric characters and can include
    // underscore and period special characters. It cannot end with special character.
    .regex(/^[a-zA-Z0-9]+([_.]?[a-zA-Z0-9])*$/)
    .required()
    .messages({
      'string.pattern.base': 'Username should start with alphanumeric characters and can include '
        + 'underscore and period special characters. It cannot end with a special character as well.',
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
    .min(3)
    .max(50)
    .lowercase()
    .regex(/^[a-zA-Z0-9]+([_.]?[a-zA-Z0-9])*$/)
    .required()
    .messages({
      'string.pattern.base': 'Username should start with alphanumeric characters and can include '
        + 'underscore and period special characters. It cannot end with a special character as well.',
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
    res.status(400).send({
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
    res.status(400).send({
      status: 'fail',
      message: error.details[0].message,
    });
  } else {
    next();
  }
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
