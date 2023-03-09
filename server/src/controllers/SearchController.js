const router = require('express').Router();
const Joi = require('joi');
const SearchService = require('../services/SearchService');
const { checkAuthentication } = require('../middlewares/checkAuthentication');
const { KNOWZONE_ERROR_TYPES, hasLowerLayerCustomError, createCustomError } = require('../knowzoneErrorHandler');
const { isObjectEmpty } = require('../utils');

const postsByOwnerSchema = (sessionUserId) => Joi.object({
  owner: Joi
    .string()
    .required()
    .custom((value, helper) => {
      if (sessionUserId && value !== sessionUserId) {
        return helper.message('Invalid owner information.');
      }
      return true;
    }),
});

const filterSchema = Joi.object({
  author: Joi
    .string()
    .regex(/^@?([a-z0-9_])*$/)
    .min(1)
    .max(15)
    .lowercase()
    .messages({
      'string.pattern.base': 'Author should start with alphanumeric characters and can include underscore.',
    }),

  createdStartDate: Joi.date(),

  createdEndDate: Joi.date(),

  modifiedStartDate: Joi.date(),

  modifiedEndDate: Joi.date(),

  description: Joi.string().max(256),

  error: Joi.string().max(256),

  solution: Joi.string().max(256),

  searchText: Joi.string().max(128),

  type: Joi.string(),

  topics: Joi
    .array()
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

const getPostsByOwner = async (req, res, next) => {
  try {
    await postsByOwnerSchema(req.session.userId).validateAsync(req.query);
    const result = await SearchService.getPostsByOwner(req.query.owner);

    res.json(result);
  } catch (err) {
    if (!hasLowerLayerCustomError()) {
      err.description = 'Error when getting posts by owner';
      err.statusCode = 500;
      err.type = KNOWZONE_ERROR_TYPES.SEARCH;
      err.data = {
        id: req.params.id,
      };
    }

    next(err);
  }
};

const filter = async (req, res, next) => {
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
      await filterSchema.validateAsync(info);
      const result = await SearchService.filter(info);
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

router.get('/', getPostsByOwner);
router.post('/filter', filter);

module.exports = router;
