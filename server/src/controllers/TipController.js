const router = require('express').Router();
const TipModel = require('../models/Tip');
const TipRepository = require('../repositories/TipRepository');

const tipRepository = new TipRepository(TipModel);

const create = (req, res) => {
  // example usage: Don't send all the data in req.body to the service/repository layer.
  const result = tipRepository.create(req.body);
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
  const result = await tipRepository.updateById(req.params.id, req.body);
  res.json({ message: result });
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
router.post('/', create);

// Retrieve all tip posts
router.get('/', findAll);

// Retrieve a single tip post with id
router.get('/:id', findById);

// Update a tip post with id
router.put('/:id', updateById);

// Delete a tip post with id
router.delete('/:id', deleteById);

// Delete all tip posts
router.delete('/', deleteAll);

module.exports = router;
