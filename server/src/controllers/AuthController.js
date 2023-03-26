const router = require('express').Router();
const Joi = require('joi');
const UserModel = require('../models/User');
const AuthService = require('../services/AuthService');
const { checkAuthentication } = require('../middlewares/checkAuthentication');
const {
  hasLowerLayerCustomError,
  changeToCustomError,
  KNOWZONE_ERROR_TYPES,
  createErrorResponse,
} = require('../knowzoneErrorHandler');
const { createSuccessResponse } = require('../utils');

const auth = new AuthService(UserModel);

const loginApiSchema = Joi.object({
  username: Joi
    .string()
    .required()
    .min(1)
    .max(15)
    .lowercase()
    .regex(/^@?([a-z0-9_])*$/)
    .messages({
      'string.pattern.base': 'Username should start with alphanumeric characters and can include underscore.',
    }),

  password: Joi
    .string()
    .required()
    .min(8)
    .max(128)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&_.,][\S]*$/)
    .messages({
      'string.pattern.base': 'Password should be at least 8 characters and contain at least one '
        + 'letter, one special character "@$!%*#?&_." and one integer.',
    }),
});

const registerApiSchema = Joi.object({
  username: Joi
    .string()
    .required()
    .min(1)
    .max(15)
    .lowercase()
    .regex(/^@?([a-z0-9_])*$/)
    .messages({
      'string.pattern.base': 'Username should start with alphanumeric characters and can include underscore.',
    }),

  password: Joi
    .string()
    .required()
    .min(8)
    .max(128)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&_.,][\S]*$/)
    .messages({
      'string.pattern.base': 'Password should be at least 8 characters and contain at least one '
        + 'letter, one special character "@$!%*#?&_." and one integer.',
    }),

  name: Joi
    .string()
    .required()
    .trim()
    .min(3)
    .max(50),

  email: Joi
    .string()
    .required()
    .email()
    .min(3)
    .max(254)
    .lowercase(),

  bio: Joi
    .string()
    .max(256),
});

const login = async (req, res, next) => {
  try {
    await loginApiSchema.validateAsync(req.body);
    const result = await auth.login(req.body);

    req.session.userId = result.id;
    req.session.username = result.username;
    req.session.name = result.name;
    req.session.email = result.email;
    req.session.bio = result.bio;

    res.json({ ...result, ...createSuccessResponse('Login is successful') });
  } catch (err) {
    if (!hasLowerLayerCustomError(err)) {
      changeToCustomError(err, {
        description: 'Error when login',
        statusCode: 500,
        type: KNOWZONE_ERROR_TYPES.AUTH,
      });
    }

    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    await registerApiSchema.validateAsync(req.body);
    const result = await auth.register(req.body);

    req.session.userId = result.id;
    req.session.username = result.username;
    req.session.name = result.name;
    req.session.email = result.email;
    req.session.bio = result.bio;

    res.json({ ...result, ...createSuccessResponse('Register is successful') });
  } catch (err) {
    if (!hasLowerLayerCustomError(err)) {
      changeToCustomError(err, {
        description: 'Error when register',
        statusCode: 500,
        type: KNOWZONE_ERROR_TYPES.AUTH,
      });
    }

    next(err);
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(400).json(createErrorResponse(err));
    } else {
      res.clearCookie(process.env.SESSION_NAME);
      res.json(createSuccessResponse('Logout is successful'));
    }
  });
};

const checkUserSession = async (req, res) => {
  const { id } = req.params;

  req.session.reload(async (error) => {
    if (!error && 'userId' in req.session && req.session.userId === id) {
      const result = await auth.getUserInformation(id);
      res.json(result);
    } else {
      res.status(401).json(createErrorResponse('User is not authorized.'));
    }
  });
};

router.post('/login', login);

router.post('/register', register);

router.post('/logout', checkAuthentication, logout);

router.get('/checkUserSession/:id', checkUserSession);

module.exports = router;
