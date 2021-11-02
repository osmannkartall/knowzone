const router = require('express').Router();
const BugfixModel = require('../models/Bugfix');
const BugfixRepository = require('../repositories/BugfixRepository');
const { uploadImages, preparePost } = require('../middlewares/uploader');
const { checkAuthentication } = require('../middlewares/auth');
const { createResponse, KnowzoneError, KNOWZONE_ERROR_TYPES } = require('../middlewares/errorHandler');

const bugfixRepository = new BugfixRepository(BugfixModel);

const create = async (_, res, next) => {
  try {
    const bugfix = res.locals.data;

    await bugfixRepository.create(bugfix);

    res.json(createResponse('success', 'Created the record successfully'));
  } catch (err) {
    next(new KnowzoneError({
      type: KNOWZONE_ERROR_TYPES.POST,
      code: 400,
      description: 'Error when creating the record',
      stack: err.stack,
    }));
  }
};

const findAll = async (_, res, next) => {
  try {
    res.send(await bugfixRepository.findAll());
  } catch (err) {
    next(new KnowzoneError({
      type: KNOWZONE_ERROR_TYPES.POST,
      code: 400,
      description: 'Error when reading record list',
      stack: err.stack,
    }));
  }
};

const findById = async (req, res, next) => {
  try {
    res.send(await bugfixRepository.findById(req.params.id));
  } catch (err) {
    next(new KnowzoneError({
      type: KNOWZONE_ERROR_TYPES.POST,
      code: 400,
      description: 'Error when finding record with the given ID',
      stack: err.stack,
      id: req.params.id,
    }));
  }
};

const updateById = async (req, res, next) => {
  try {
    res.json(await bugfixRepository.updateById(req.params.id, res.locals.data));
  } catch (err) {
    next(new KnowzoneError({
      type: KNOWZONE_ERROR_TYPES.POST,
      code: 400,
      description: 'Error when updating record with the given ID',
      stack: err.stack,
      id: req.params.id,
      record: res.locals.data,
    }));
  }
};

const deleteById = async (req, res, next) => {
  try {
    await bugfixRepository.deleteById(req.params.id);

    res.json(createResponse('success', 'Deleted the record successfully'));
  } catch (err) {
    next(new KnowzoneError({
      type: KNOWZONE_ERROR_TYPES.POST,
      code: 400,
      description: 'Error when deleting record with the given ID',
      stack: err.stack,
      id: req.params.id,
    }));
  }
};

const deleteAll = async (_, res, next) => {
  try {
    await bugfixRepository.deleteAll();

    res.json(createResponse('success', 'Deleted record list successfully'));
  } catch (err) {
    next(new KnowzoneError({
      type: KNOWZONE_ERROR_TYPES.POST,
      code: 400,
      description: 'Error when deleting record list',
      stack: err.stack,
    }));
  }
};

// Create a new bugfix post
router.post('/', checkAuthentication, uploadImages, preparePost, create);

// Retrieve all bugfix posts
router.get('/', checkAuthentication, findAll);

// Retrieve a single bugfix post with id
router.get('/:id', checkAuthentication, findById);

// Update a bugfix post with id
router.put('/:id', checkAuthentication, uploadImages, preparePost, updateById);

// Delete a bugfix post with id
router.delete('/:id', checkAuthentication, deleteById);

// Delete all bugfix posts
router.delete('/', checkAuthentication, deleteAll);

module.exports = router;
