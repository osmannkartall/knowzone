const router = require('express').Router();
const TipModel = require('../models/Tip');
const TipRepository = require('../repositories/TipRepository');
const { uploadImages, preparePost } = require('../middlewares/uploader');

const tipRepository = new TipRepository(TipModel);

const create = async (_, res) => {
  const tip = res.locals.data;
  const result = await tipRepository.create(tip);
  res.json({ message: result });
};

const findAll = async (_, res) => {
  const result = await tipRepository.findAll();
  res.send(result);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const result = await tipRepository.findById(id);
  res.send(result);
};

const updateById = async (req, res) => {
  const result = await tipRepository.updateById(req.params.id, res.locals.data);
  res.json(result);
};

const deleteById = async (req, res) => {
  const result = await tipRepository.deleteById(req.params.id);
  res.json({ message: result });
};

const deleteAll = async (_, res) => {
  const result = await tipRepository.deleteAll();
  res.send(result);
};

// Create a new tip post
router.post('/', uploadImages, preparePost, create);

// Retrieve all tip posts
router.get('/', findAll);

// Retrieve a single tip post with id
router.get('/:id', findById);

// Update a tip post with id
router.put('/:id', uploadImages, preparePost, updateById);

// Delete a tip post with id
router.delete('/:id', deleteById);

// Delete all tip posts
router.delete('/', deleteAll);

module.exports = router;
