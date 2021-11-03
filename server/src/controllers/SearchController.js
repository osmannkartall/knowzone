const router = require('express').Router();
const Joi = require('joi');
const SearchService = require('../services/SearchService');
const { checkAuthentication } = require('../middlewares/auth');
const KnowzoneError = require('../KnowzoneError');
const { KNOWZONE_ERROR_TYPES } = require('../middlewares/errorHandler');
const { isJoiError } = require('../utils');

const postsByOwnerSchema = (sessionUserId) => Joi.object({
  owner: Joi.string()
    .required()
    .custom((value, helper) => {
      if (sessionUserId && value !== sessionUserId) {
        return helper.message('Invalid owner information.');
      }
      return true;
    }),
});

const getPostsByOwner = async (req, res, next) => {
  try {
    await postsByOwnerSchema(req.session.userId).validateAsync(req.query);
    const result = await SearchService.getPostsByOwner(req.query.owner);

    res.json(result);
  } catch (err) {
    const joiError = isJoiError(err);

    next(new KnowzoneError({
      type: KNOWZONE_ERROR_TYPES.SEARCH,
      code: joiError ? 400 : 500,
      description: joiError ? err.details[0].message : 'Error when getting posts by owner',
      stack: err.stack,
      id: req.params.id,
    }));
  }
};

const filter = async (req, res) => {
  const info = req.body;
  if (info) {
    const result = await SearchService.filter(info);
    res.json(result);
  } else {
    res.status(500).send({
      message: 'No search filter info',
    });
  }
};

// Retrieve all posts by owner
router.get('/', checkAuthentication, getPostsByOwner);
router.post('/filter', checkAuthentication, filter);

module.exports = router;
