const router = require('express').Router();
const Joi = require('joi');
const SearchService = require('../services/SearchService');
const { checkAuthentication } = require('../middlewares/checkAuthentication');
const {
  KNOWZONE_ERROR_TYPES,
  hasLowerLayerCustomError,
  createCustomError,
} = require('../knowzoneErrorHandler');
const { isObjectEmpty } = require('../utils');

const searchSchema = Joi.object({
  createdAtStartDate: Joi.date(),

  createdAtEndDate: Joi.date(),

  updatedAtStartDate: Joi.date(),

  updatedAtEndDate: Joi.date(),

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
      const result = await SearchService.search(info);
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

module.exports = router;
