const router = require('express').Router();
const TipModel = require('../models/Tip');
const TipRepository = require('../repositories/TipRepository');
const { uploadImages, preparePost } = require('../middlewares/uploader');
const { checkAuthentication } = require('../middlewares/auth');
const { KnowzoneError, KNOWZONE_ERROR_TYPES, createResponse } = require('../middlewares/errorHandler');

const tipRepository = new TipRepository(TipModel);

const create = async (_, res, next) => {
  try {
    const tip = res.locals.data;

    await tipRepository.create(tip);

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

const findAll = async (_req, res, next) => {
  try {
    res.send(await tipRepository.findAll());
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
    res.send(await tipRepository.findById(req.params.id));
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
    res.json(await tipRepository.updateById(req.params.id, res.locals.data));
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
    await tipRepository.deleteById(req.params.id);

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
    await tipRepository.deleteAll();

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

router.post('/', checkAuthentication, uploadImages, preparePost, create);

router.get('/', checkAuthentication, findAll);

router.get('/:id', checkAuthentication, findById);

router.put('/:id', checkAuthentication, uploadImages, preparePost, updateById);

router.delete('/:id', checkAuthentication, deleteById);

router.delete('/', checkAuthentication, deleteAll);

module.exports = router;
