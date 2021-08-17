const router = require('express').Router();
const BugFixModel = require('../models/BugFix');
const BugFixRepository = require('../repositories/BugFixRepository');

const bugFixRepository = new BugFixRepository(BugFixModel);

const create = (req, res) => {
  const bugFix = {
    owner: req.body.owner,
    links: req.body.links,
    tags: req.body.tags,
    error: req.body.error,
    solution: req.body.solution,
    description: req.body.description,
  };

  const result = bugFixRepository.create(bugFix);
  res.send(result);
};

const findAll = async (_, res) => {
  const result = await bugFixRepository.findAll();
  res.send(result);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const result = await bugFixRepository.findById(id);
  res.send(result);
};

const updateById = async (req, res) => {
  const result = await bugFixRepository.updateById(req.params.id, req.body);
  res.send(result);
};

const deleteById = async (req, res) => {
  const result = await bugFixRepository.deleteById(req.params.id);
  res.send(result);
};

const deleteAll = async (_, res) => {
  const result = await bugFixRepository.deleteAll();
  res.send(result);
};

// Create a new bug fix post
router.post('/', create);

// Retrieve all bug fix posts
router.get('/', findAll);

// Retrieve a single bug fix post with id
router.get('/:id', findById);

// Update a bug fix post with id
router.put('/:id', updateById);

// Delete a bug fix post with id
router.delete('/:id', deleteById);

// Delete all bug fix posts
router.delete('/', deleteAll);

module.exports = router;
