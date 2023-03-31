const router = require('express').Router();
const Joi = require('joi');
const PostRepository = require('../repositories/PostRepository');
const {
  uploadImages,
  preparePostForCreate,
  preparePostForUpdate,
} = require('../middlewares/uploader');
const { createSuccessResponse } = require('../utils');
const { KNOWZONE_ERROR_TYPES, changeToCustomError } = require('../knowzoneErrorHandler');
const { checkAuthentication } = require('../middlewares/checkAuthentication');
const { FORM_SCHEMA_CONFIGS, POST_SCHEMA_CONFIGS } = require('../models/schemaConfigs');
const { POST_VALIDATION_MESSAGES, VALIDATION_MESSAGES } = require('../models/validationMessages');
const validators = require('../validators');

const postRepository = new PostRepository();

const typeSchemaPart = (
  Joi.string()
    .max(FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE)
    .message(VALIDATION_MESSAGES.MAX_LEN('type', FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE))
    .min(FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE)
    .message(VALIDATION_MESSAGES.MIN_LEN('type', FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE))
    .required()
);

const updateSchema = Joi.object({
  topics: (
    Joi.array()
      .items(
        Joi.string()
          .regex(new RegExp(`^@?([a-z0-9-]){1,${POST_SCHEMA_CONFIGS.MAX_LEN_TOPIC}}$`))
          .message(POST_VALIDATION_MESSAGES.INVALID_TOPIC),
      )
      .required()
      .min(POST_SCHEMA_CONFIGS.MIN_NUM_TOPICS)
      .message(VALIDATION_MESSAGES.MIN_NUM('topics', POST_SCHEMA_CONFIGS.MIN_NUM_TOPICS))
      .max(POST_SCHEMA_CONFIGS.MAX_NUM_TOPICS)
      .message(VALIDATION_MESSAGES.MAX_NUM('topics', POST_SCHEMA_CONFIGS.MAX_NUM_TOPICS))
  ),
  content: (
    Joi.object()
      .unknown()
      .custom((content, helper) => {
        if (!validators.hasObjectMinNumKey(content)) {
          return helper.message(
            VALIDATION_MESSAGES.MIN_KEY('content', FORM_SCHEMA_CONFIGS.MIN_NUM_CONTENT),
          );
        }

        if (!validators.isValidMaxNumKey(content, FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT)) {
          return helper.message(
            VALIDATION_MESSAGES.MAX_KEY('content', FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT),
          );
        }

        if (!validators.isValidMaxLenKeys(content, FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_CONTENT)) {
          return helper.message(
            VALIDATION_MESSAGES.MAX_LEN(
              'content field name',
              FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_CONTENT,
            ),
          );
        }

        if (!validators.isAnyFieldFilled(content)) {
          return helper.message('at least one content field must be filled');
        }

        return content;
      })
      .required()
  ),
  // This should not be validated. owner is added by the middleware.
  owner: Joi.object(),
}).required();

const createSchema = updateSchema.keys({ type: typeSchemaPart });

const create = async (_, res, next) => {
  try {
    const post = res.locals.data;
    await createSchema.validateAsync(post);
    await postRepository.create(post);
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

const findAll = async (req, res, next) => {
  try {
    const { type } = req.query;
    const { userId } = req.session;

    if (type) {
      await typeSchemaPart.validateAsync(type);

      res.send(await postRepository.find({ type, 'owner.id': userId }));
    } else {
      res.send(await postRepository.find({ 'owner.id': userId }));
    }
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
    res.send(await postRepository.findOne({ _id: req.params.id, 'owner.id': req.session.userId }));
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
    await updateSchema.validateAsync(res.locals.data);

    const { content, ...rest } = res.locals.data;

    const post = await postRepository.findOne(
      { _id: req.params.id, 'owner.id': req.session.userId },
    );

    if (!post) {
      throw Error('Error when updating record with the given ID');
    }

    Object.entries(content ?? {}).forEach(([k, v]) => { post.content[k] = v; });
    Object.entries(rest ?? {}).forEach(([k, v]) => { post[k] = v; });

    // TODO: Now, this might be redundant with latest mongoose version.
    post.markModified('content');

    res.json(await post.save());
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
    const queryResult = await postRepository.deleteOne(
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
      type: KNOWZONE_ERROR_TYPES.POST,
      data: {
        id: req.params.id,
      },
    });

    next(err);
  }
};

const deleteAll = async (req, res, next) => {
  try {
    await postRepository.deleteMany({ 'owner.id': req.session.userId });

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
