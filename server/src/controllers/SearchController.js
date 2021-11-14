const router = require('express').Router();
const Joi = require('joi');
const SearchService = require('../services/SearchService');
const { checkAuthentication } = require('../middlewares/checkAuthentication');
const { KNOWZONE_ERROR_TYPES, hasLowerLayerCustomError } = require('../knowzoneErrorHandler');

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
