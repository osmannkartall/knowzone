const router = require('express').Router();
const multer = require('multer');
const TipModel = require('../models/Tip');
const TipRepository = require('../repositories/TipRepository');

const tipRepository = new TipRepository(TipModel);
const upload = multer({ storage: multer.memoryStorage() });

const create = (req, res) => {
  const tip = {};
  const images = [];

  if (req.body) {
    Object.entries(req.body).forEach(([k, v]) => {
      tip[k] = JSON.parse(v);
    });
  }

  if (req.files) {
    req.files.forEach((f) => {
      if (f.originalname && f.buffer && f.mimetype) {
        images.push({ name: f.originalname, content: f.buffer, mime: f.mimetype });
      }
    });
    tip.images = images;
  }

  const result = tipRepository.create(tip);
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
  const tip = {};
  const images = [];

  if (req.body) {
    Object.entries(req.body).forEach(([k, v]) => {
      tip[k] = JSON.parse(v);
    });
  }

  if (req.files) {
    req.files.forEach((f) => {
      if (f.originalname && f.buffer && f.mimetype) {
        images.push({ name: f.originalname, content: f.buffer, mime: f.mimetype });
      }
    });
    tip.images = images;
  }

  const result = await tipRepository.updateById(req.params.id, tip);
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
router.post('/', upload.array('image'), create);

// Retrieve all tip posts
router.get('/', findAll);

// Retrieve a single tip post with id
router.get('/:id', findById);

// Update a tip post with id
router.put('/:id', upload.array('image'), updateById);

// Delete a tip post with id
router.delete('/:id', deleteById);

// Delete all tip posts
router.delete('/', deleteAll);

module.exports = router;
