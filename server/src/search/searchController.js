import { Router } from 'express';
import Joi from 'joi';
import SearchService from './searchService.js';
import checkAuthentication from '../auth/checkAuthentication.js';
import {
  KNOWZONE_ERROR_TYPES,
  hasLowerLayerCustomError,
  createCustomError,
} from '../common/knowzoneErrorHandler.js';
import { isObjectEmpty } from '../common/utils.js';

const router = Router();

const searchSchema = Joi.object({
  createdAtStartDate: Joi.date(),

  createdAtEndDate: Joi.date(),

  updatedAtStartDate: Joi.date(),

  updatedAtEndDate: Joi.date(),

  searchText: Joi.string().max(128),

  typeName: Joi.string(),

  topics: Joi.array()
    .max(5)
    .items(
      Joi
        .string()
        .lowercase()
        .regex(/^@?([a-z0-9-]){1,30}$/)
        .messages({
          'string.pattern.base': 'One of topics includes invalid character.',
        }),
    ),
});

const search = async (req, res, next) => {
  try {
    const info = req.body;

    if (isObjectEmpty(info)) {
      const err = createCustomError({
        description: 'No search filter information.',
        statusCode: 500,
        type: KNOWZONE_ERROR_TYPES.SEARCH,
      });
      next(err);
    } else {
      await searchSchema.validateAsync(info);

      info.ownerId = req.session.userId;
      const result = await SearchService.search(info, req.query.cursor);
      res.json(result);
    }
  } catch (err) {
    if (!hasLowerLayerCustomError()) {
      err.description = 'Error when filtering posts by search query';
      err.statusCode = 500;
      err.type = KNOWZONE_ERROR_TYPES.SEARCH;
    }
    next(err);
  }
};

const getPostsByTopics = async (req, res, next) => {
  try {
    const info = req.body;

    if (isObjectEmpty(info)) {
      const err = createCustomError({
        description: 'No search filter information.',
        statusCode: 500,
        type: KNOWZONE_ERROR_TYPES.SEARCH,
      });
      next(err);
    } else {
      await searchSchema.validateAsync(info);

      const result = await SearchService.search(info, req.query.cursor);
      res.json(result);
    }
  } catch (err) {
    if (!hasLowerLayerCustomError()) {
      err.description = 'Error when filtering posts by search query';
      err.statusCode = 500;
      err.type = KNOWZONE_ERROR_TYPES.SEARCH;
    }
    next(err);
  }
};

router.post('/', checkAuthentication, search);

router.post('/topics', checkAuthentication, getPostsByTopics);

export default router;
