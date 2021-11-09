const router = require('express').Router();
const BugfixRepository = require('../repositories/BugfixRepository');
const { uploadImages, preparePostForCreate, preparePostForUpdate } = require('../middlewares/uploader');
const { checkAuthentication } = require('../middlewares/checkAuthentication');
const { createSuccessResponse } = require('../utils');
const { KNOWZONE_ERROR_TYPES, changeToCustomError } = require('../knowzoneErrorHandler');

const bugfixRepository = new BugfixRepository();

const create = async (_, res, next) => {
  try {
    const bugfix = res.locals.data;

    await bugfixRepository.create(bugfix);

    res.json(createSuccessResponse('Created the record successfully'));
  } catch (err) {
    changeToCustomError(err, {
      description: 'Error when creating new record',
      statusCode: 500,
      type: KNOWZONE_ERROR_TYPES.POST,
    });

    next(err);
  }
};

const findAll = async (_, res, next) => {
  try {
    res.send(await bugfixRepository.findAll());
  } catch (err) {
    changeToCustomError(err, {
      description: 'Error when reading record list',
      statusCode: 500,
      type: KNOWZONE_ERROR_TYPES.POST,
    });

    next(err);
  }
};

const findById = async (req, res, next) => {
  try {
    res.send(await bugfixRepository.findById(req.params.id));
  } catch (err) {
    changeToCustomError(err, {
      description: 'Error when finding record with the given ID',
      statusCode: 500,
      type: KNOWZONE_ERROR_TYPES.POST,
      data: {
        id: req.params.id,
      },
    });

    next(err);
  }
};

const updateById = async (req, res, next) => {
  try {
    res.json(await bugfixRepository.updateById(req.params.id, res.locals.data));
  } catch (err) {
    changeToCustomError(err, {
      description: 'Error when updating record with the given ID',
      statusCode: 500,
      type: KNOWZONE_ERROR_TYPES.POST,
      data: {
        id: req.params.id,
        record: res.locals.data,
      },
    });

    next(err);
  }
};

const deleteById = async (req, res, next) => {
  try {
    await bugfixRepository.deleteById(req.params.id);

    res.json(createSuccessResponse('Deleted the record successfully'));
  } catch (err) {
    changeToCustomError(err, {
      description: 'Error when deleting record with the given ID',
      statusCode: 500,
      type: KNOWZONE_ERROR_TYPES.POST,
      data: {
        id: req.params.id,
      },
    });

    next(err);
  }
};

const deleteAll = async (_, res, next) => {
  try {
    await bugfixRepository.deleteAll();

    res.json(createSuccessResponse('Deleted record list successfully'));
  } catch (err) {
    changeToCustomError(err, {
      description: 'Error when deleting record list',
      statusCode: 500,
      type: KNOWZONE_ERROR_TYPES.POST,
    });

    next(err);
  }
};

// Create a new bugfix post
router.post('/', checkAuthentication, uploadImages, preparePostForCreate, create);

// Retrieve all bugfix posts
router.get('/', checkAuthentication, findAll);

// Retrieve a single bugfix post with id
router.get('/:id', checkAuthentication, findById);

// Update a bugfix post with id
router.put('/:id', checkAuthentication, uploadImages, preparePostForUpdate, updateById);

// Delete a bugfix post with id
router.delete('/:id', checkAuthentication, deleteById);

// Delete all bugfix posts
router.delete('/', checkAuthentication, deleteAll);

module.exports = router;
