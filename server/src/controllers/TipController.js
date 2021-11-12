const router = require('express').Router();
const TipRepository = require('../repositories/TipRepository');
const { uploadImages, preparePostForCreate, preparePostForUpdate } = require('../middlewares/uploader');
const { checkAuthentication } = require('../middlewares/checkAuthentication');
const { createSuccessResponse } = require('../utils');
const { KNOWZONE_ERROR_TYPES, changeToCustomError } = require('../knowzoneErrorHandler');

const tipRepository = new TipRepository();

const create = async (_, res, next) => {
  try {
    const tip = res.locals.data;
    await tipRepository.create(tip);

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

const findAll = async (_req, res, next) => {
  try {
    res.send(await tipRepository.findAll());
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
    res.send(await tipRepository.findById(req.params.id));
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
    res.json(await tipRepository.updateById(req.params.id, res.locals.data));
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
    await tipRepository.deleteById(req.params.id);

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
    await tipRepository.deleteAll();

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

router.post('/', checkAuthentication, uploadImages, preparePostForCreate, create);

router.get('/', checkAuthentication, findAll);

router.get('/:id', checkAuthentication, findById);

router.put('/:id', checkAuthentication, uploadImages, preparePostForUpdate, updateById);

router.delete('/:id', checkAuthentication, deleteById);

router.delete('/', checkAuthentication, deleteAll);

module.exports = router;
