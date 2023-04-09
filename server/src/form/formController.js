import { Router } from 'express';
import Joi from 'joi';
import FormRepository from './formRepository.js';
import { createSuccessResponse } from '../common/utils.js';
import { KNOWZONE_ERROR_TYPES, changeToCustomError } from '../common/knowzoneErrorHandler.js';
import checkAuthentication from '../auth/checkAuthentication.js';
import FORM_SCHEMA_CONFIGS from './formSchemaConfigs.js';
import validators from '../common/validators.js';
import formValidators from './formValidators.js';
import VALIDATION_MESSAGES from '../common/validationMessages.js';
import FORM_VALIDATION_MESSAGES from './formValidationMessages.js';

const router = Router();
const formRepository = new FormRepository();

const createSchema = Joi.object({
  type: Joi.string()
    .max(FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE)
    .min(FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE)
    .required(),

  content: Joi.object()
    .unknown()
    .custom((content, helpers) => {
      if (!validators.hasObjectMinNumKey(content)) {
        return helpers.message(
          VALIDATION_MESSAGES.MIN_KEY('content', FORM_SCHEMA_CONFIGS.MIN_NUM_CONTENT),
        );
      }

      if (!validators.isValidMaxNumKey(content, FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT)) {
        return helpers.message(
          VALIDATION_MESSAGES.MAX_KEY('content', FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT),
        );
      }

      if (!formValidators.isAllValidKeyValue(content)) {
        return helpers.message(
          [
            VALIDATION_MESSAGES.MIN_LEN('name'),
            VALIDATION_MESSAGES.MAX_LEN('name', FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_CONTENT),
            VALIDATION_MESSAGES.MIN_LEN('component type'),
            FORM_VALIDATION_MESSAGES.INVALID_COMPONENT,
          ].join('. '),
        );
      }

      if (!formValidators.isValidMaxNumImageComponent(content)) {
        return helpers.message(FORM_VALIDATION_MESSAGES.MAX_IMAGE_COMPONENT);
      }

      return content;
    })
    .required(),
}).required();

const filterSchema = Joi.object({
  fields: Joi.object(),

  projection: [
    Joi.object(),
    Joi.string(),
    Joi.array().items(Joi.string()),
  ],

  single: Joi.boolean(),
});

const create = async (req, res, next) => {
  try {
    await createSchema.validateAsync(req.body);

    const form = req.body;
    form.owner = {
      id: req.session.userId,
      username: req.session.username,
      name: req.session.name,
    };

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

const getByType = async (req, res, next) => {
  try {
    res.json(
      await formRepository.findOne({ 'owner.id': req.session.userId, type: req.query.type }),
    );
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
    res.send(await formRepository.findOne({ _id: req.params.id, 'owner.id': req.session.userId }));
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
    await filterSchema.validateAsync(req.body);

    let fields = { 'owner.id': req.session.userId };

    if (req.body?.fields) {
      fields = { ...fields, ...req.body.fields };
    }

    const result = await formRepository.find(fields, req.body.projection, req.query.cursor);

    if (req.body?.single && result.length > 0) {
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
    const queryResult = await formRepository.deleteOne(
      { _id: req.params.id, 'owner.id': req.session.userId },
    );

    if (queryResult.deletedCount > 0) {
      res.json(createSuccessResponse('Deleted the record successfully'));
    } else {
      res.json(createSuccessResponse('No record for the given ID'));
    }
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

const deleteAll = async (req, res, next) => {
  try {
    await formRepository.deleteMany({ 'owner.id': req.session.userId });

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

router.get('/', checkAuthentication, getByType);

router.post('/filter', checkAuthentication, filter);

router.get('/:id', checkAuthentication, findById);

router.delete('/:id', checkAuthentication, deleteById);

router.delete('/', checkAuthentication, deleteAll);

export default router;
