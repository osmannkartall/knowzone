const router = require('express').Router();
const BugFixesModel = require('../models/BugFixes');
const BugFixesRepository = require('../repositories/BugFixesRepository');

const bugFixesRepository = new BugFixesRepository(BugFixesModel);

const create = (req, res) => {
  const bugFix = {
    owner: req.body.owner,
    links: req.body.links,
    tags: req.body.tags,
    error: req.body.error,
    solution: req.body.solution,
    description: req.body.description,
  };

  const result = bugFixesRepository.create(bugFix);
  res.send(result);
};

const findAll = async (_, res) => {
  const result = await bugFixesRepository.findAll();
  res.send(result);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const result = await bugFixesRepository.findById(id);
  res.send(result);
};

const updateById = async (req, res) => {
  const result = await bugFixesRepository.updateById(req.params.id, req.body);
  res.send(result);
};

const deleteById = async (req, res) => {
  const result = await bugFixesRepository.deleteById(req.params.id);
  res.send(result);
};

const deleteAll = async (_, res) => {
  const result = await bugFixesRepository.deleteAll();
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
