const router = require('express').Router();
const BugfixModel = require('../models/Bugfix');
const BugfixRepository = require('../repositories/BugfixRepository');
const { uploadImages, preparePost } = require('../middlewares/uploader');

const bugfixRepository = new BugfixRepository(BugfixModel);

const create = async (_, res) => {
  const bugfix = res.locals.data;
  const result = await bugfixRepository.create(bugfix);
  res.json({ message: result });
};

const findAll = async (_, res) => {
  const result = await bugfixRepository.findAll();
  res.send(result);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const result = await bugfixRepository.findById(id);
  res.send(result);
};

const updateById = async (req, res) => {
  const result = await bugfixRepository.updateById(req.params.id, res.locals.data);
  res.json(result);
};

const deleteById = async (req, res) => {
  const result = await bugfixRepository.deleteById(req.params.id);
  res.json({ message: result });
};

const deleteAll = async (_, res) => {
  const result = await bugfixRepository.deleteAll();
  res.send(result);
};

// Create a new bugfix post
router.post('/', uploadImages, preparePost, create);

// Retrieve all bugfix posts
router.get('/', findAll);

// Retrieve a single bugfix post with id
router.get('/:id', findById);

// Update a bugfix post with id
router.put('/:id', uploadImages, preparePost, updateById);

// Delete a bugfix post with id
router.delete('/:id', deleteById);

// Delete all bugfix posts
router.delete('/', deleteAll);

module.exports = router;
