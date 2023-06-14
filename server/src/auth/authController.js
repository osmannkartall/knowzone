import { Router } from 'express';
import Joi from 'joi';
import UserModel from './user.js';
import AuthService from './authService.js';
import checkAuthentication from './checkAuthentication.js';
import {
  hasLowerLayerCustomError,
  changeToCustomError,
  KNOWZONE_ERROR_TYPES,
  createErrorResponse,
} from '../common/knowzoneErrorHandler.js';
import { createSuccessResponse } from '../common/utils.js';

const router = Router();

const auth = new AuthService(UserModel);

const loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .min(1)
    .max(15)
    .lowercase()
    .regex(/^@?([a-z0-9_])*$/)
    .messages({
      'string.pattern.base': 'Username should start with alphanumeric characters and can include underscore.',
    }),

  password: Joi.string()
    .required()
    .min(8)
    .max(128),
});

const registerSchema = Joi.object({
  username: Joi.string()
    .required()
    .min(1)
    .max(15)
    .lowercase()
    .regex(/^@?([a-z0-9_])*$/)
    .messages({
      'string.pattern.base': 'Username should start with alphanumeric characters and can include underscore.',
    }),

  password: Joi.string()
    .required()
    .min(8)
    .max(128),

  name: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(50),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .min(3)
    .max(254)
    .required()
    .messages({ 'string.email': 'Invalid email format.' }),

  bio: Joi.string().max(256),
});

const login = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
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
    await registerSchema.validateAsync(req.body);
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

export default router;
