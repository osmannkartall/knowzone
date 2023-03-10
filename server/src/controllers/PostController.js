const router = require('express').Router();
const PostRepository = require('../repositories/PostRepository');
const { uploadImages, preparePostForCreate, preparePostForUpdate } = require('../middlewares/uploader');
const { createSuccessResponse } = require('../utils');
const { KNOWZONE_ERROR_TYPES, changeToCustomError } = require('../knowzoneErrorHandler');
const { checkAuthentication } = require('../middlewares/checkAuthentication');

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
    const { userId } = req.session;

    if (type) {
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
    const { content, ...rest } = res.locals.data;
    const post = await postRepository.findOne(
      { _id: req.params.id, 'owner.id': req.session.userId },
    );

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
