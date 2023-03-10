const router = require('express').Router();
const FormRepository = require('../repositories/FormRepository');
const { createSuccessResponse } = require('../utils');
const { KNOWZONE_ERROR_TYPES, changeToCustomError } = require('../knowzoneErrorHandler');
const { checkAuthentication } = require('../middlewares/checkAuthentication');

const formRepository = new FormRepository();

const create = async (req, res, next) => {
  try {
    const form = req.body;
    await formRepository.create(form);
    res.json(createSuccessResponse('Created the record successfully'));
  } catch (err) {
    changeToCustomError(err, {
      description: 'Error when creating new record',
      statusCode: 500,
      type: KNOWZONE_ERROR_TYPES.FORM,
    });

    next(err);
  }
};

const findAll = async (_, res, next) => {
  try {
    res.send(await formRepository.findAll());
  } catch (err) {
    changeToCustomError(err, {
      description: 'Error when reading record list',
      statusCode: 500,
      type: KNOWZONE_ERROR_TYPES.FORM,
    });

    next(err);
  }
};

const findById = async (req, res, next) => {
  try {
    res.send(await formRepository.findById(req.params.id));
  } catch (err) {
    changeToCustomError(err, {
      description: 'Error when finding record with the given ID',
      statusCode: 500,
      type: KNOWZONE_ERROR_TYPES.FORM,
      data: {
        id: req.params.id,
      },
    });

    next(err);
  }
};

const filter = async (req, res, next) => {
  try {
    const { fields, projection, single } = req.body ?? {};
    const result = await formRepository.find(fields, projection);

    if (single && result.length > 0) {
      res.send(result[0]);
    } else {
      res.send(result);
    }
  } catch (err) {
    changeToCustomError(err, {
      description: 'Error when getting records',
      statusCode: 500,
      type: KNOWZONE_ERROR_TYPES.FORM,
    });

    next(err);
  }
};

const deleteById = async (req, res, next) => {
  try {
    await formRepository.deleteById(req.params.id);

    res.json(createSuccessResponse('Deleted the record successfully'));
  } catch (err) {
    changeToCustomError(err, {
      description: 'Error when deleting record with the given ID',
      statusCode: 500,
      type: KNOWZONE_ERROR_TYPES.FORM,
      data: {
        id: req.params.id,
      },
    });

    next(err);
  }
};

const deleteAll = async (_, res, next) => {
  try {
    await formRepository.deleteAll();

    res.json(createSuccessResponse('Deleted record list successfully'));
  } catch (err) {
    changeToCustomError(err, {
      description: 'Error when deleting record list',
      statusCode: 500,
      type: KNOWZONE_ERROR_TYPES.FORM,
    });

    next(err);
  }
};

router.post('/', checkAuthentication, create);

router.get('/', checkAuthentication, findAll);

router.post('/filter', checkAuthentication, filter);

router.get('/:id', checkAuthentication, findById);

router.delete('/:id', checkAuthentication, deleteById);

router.delete('/', checkAuthentication, deleteAll);

module.exports = router;
