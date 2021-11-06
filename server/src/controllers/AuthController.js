const router = require('express').Router();
const Joi = require('joi');
const UserModel = require('../models/User');
const AuthService = require('../services/AuthService');
const { registerValidation, checkAuthentication } = require('../middlewares/auth');
const {
  hasLowerLayerCustomError,
  changeToCustomError,
  KNOWZONE_ERROR_TYPES,
} = require('../knowzoneErrorHandler');
const { createSuccessResponse } = require('../utils');

const auth = new AuthService(UserModel);

const loginApiSchema = Joi.object({
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

const registerApiSchema = {
  ...{
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

    bio: Joi.string(),
  },
  ...loginApiSchema,
};

const login = async (req, res, next) => {
  try {
    await loginApiSchema.validateAsync(req.body);
    const result = await auth.login(req.body);

    req.session.userId = result.id;
    req.session.username = result.username;
    req.session.name = result.name;
    req.session.email = result.email;
    req.session.bio = result.bio;

    res.json({ ...result, ...createSuccessResponse('Login is successfull') });
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

const register = async (req, res) => {
  if (!req.body) {
    res.status(500).send({
      status: 'fail',
      message: 'No user info',
    });
  } else {
    const user = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      bio: req.body.bio,
    };
    const result = await auth.register(user);

    res.json(result);
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(400).json({ status: 'fail', message: err });
    } else {
      res.clearCookie(process.env.SESSION_NAME);
      res.json({ status: 'success', message: 'Logout is successful' });
    }
  });
};

const isUserLoggedIn = async (req, res) => {
  const { id } = req.params;

  req.session.reload(async (error) => {
    if (!error && 'userId' in req.session && req.session.userId === id) {
      const result = await auth.getUserInformation(id);
      res.json(result);
    } else {
      console.log('isUserLoggedIn: User is not authorized.');
      res.status(401).json({ status: 'fail', message: 'User is not authorized.' });
    }
  });
};

// Login a user.
router.post('/login', login);

// Register a user.
router.post('/register', registerValidation(registerApiSchema), register);

// Logout user.
router.post('/logout', checkAuthentication, logout);

// Check if user is logged in. If user is logged in then return user information.
router.get('/is-user-logged-in/:id', isUserLoggedIn);

module.exports = router;
