const router = require('express').Router();
const SearchService = require('../services/SearchService');

const searchService = new SearchService();

const getPostsByOwner = async (req, res) => {
  const { owner } = req.query;
  if (owner) {
    const result = await searchService.getPostsByOwner(owner);
    res.json(result);
  } else {
    res.status(500).send({
      message: 'No owner info',
    });
  }
};

// Retrieve all posts by owner
router.get('/', getPostsByOwner);

module.exports = router;
