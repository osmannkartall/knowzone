const router = require('express').Router();
const PostRepository = require('../repositories/PostRepository');
const { uploadImages, preparePostForCreate, preparePostForUpdate } = require('../middlewares/uploader');
const { createSuccessResponse } = require('../utils');
const { KNOWZONE_ERROR_TYPES, changeToCustomError } = require('../knowzoneErrorHandler');

const postRepository = new PostRepository();

const create = async (_, res, next) => {
  try {
    const post = res.locals.data;
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

    if (type) res.send(await postRepository.find({ type }));
    else res.send(await postRepository.findAll());
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
    res.send(await postRepository.findById(req.params.id));
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
    const { content, ...rest } = res.locals.data;
    const post = await postRepository.findById(req.params.id);

    if (!post) {
      throw Error('Error when updating record with the given ID');
    }

    Object.entries(content ?? {}).forEach(([k, v]) => { post.content[k] = v; });
    Object.entries(rest ?? {}).forEach(([k, v]) => { post[k] = v; });

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
    await postRepository.deleteById(req.params.id);

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
    await postRepository.deleteAll();

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

router.post('/', uploadImages, preparePostForCreate, create);

router.get('/', findAll);

router.get('/:id', findById);

router.put('/:id', uploadImages, preparePostForUpdate, updateById);

router.delete('/:id', deleteById);

router.delete('/', deleteAll);

module.exports = router;
