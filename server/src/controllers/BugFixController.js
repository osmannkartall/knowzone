const router = require('express').Router();
const multer = require('multer');
const BugFixModel = require('../models/BugFix');
const BugFixRepository = require('../repositories/BugFixRepository');

const bugFixRepository = new BugFixRepository(BugFixModel);
const upload = multer({ storage: multer.memoryStorage() });

const create = (req, res) => {
  const bugFix = {};
  const images = [];

  if (req.body) {
    Object.entries(req.body).forEach(([k, v]) => {
      bugFix[k] = JSON.parse(v);
    });
  }

  if (req.files) {
    req.files.forEach((f) => {
      if (f.originalname && f.buffer && f.mimetype) {
        images.push({ name: f.originalname, content: f.buffer, mime: f.mimetype });
      }
    });
    bugFix.images = images;
  }

  const result = bugFixRepository.create(bugFix);
  res.json({ message: result });
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
  res.json({ message: result });
};

const deleteById = async (req, res) => {
  const result = await bugFixRepository.deleteById(req.params.id);
  res.json({ message: result });
};

const deleteAll = async (_, res) => {
  const result = await bugFixRepository.deleteAll();
  res.send(result);
};

// Create a new bug fix post
router.post('/', upload.array('image'), create);

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
