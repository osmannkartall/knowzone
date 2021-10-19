const router = require('express').Router();
const SearchService = require('../services/SearchService');

const getPostsByOwner = async (req, res) => {
  const { owner } = req.query;
  if (owner) {
    const result = await SearchService.getPostsByOwner(owner);
    res.json(result);
  } else {
    res.status(500).send({
      message: 'No owner info',
    });
  }
};

const filter = async (req, res) => {
  const info = req.body;
  if (info) {
    const result = await SearchService.filter(info);
    res.json(result);
  } else {
    res.status(500).send({
      message: 'No search filter info',
    });
  }
};

// Retrieve all posts by owner
router.get('/', getPostsByOwner);
router.post('/filter', filter);

module.exports = router;
