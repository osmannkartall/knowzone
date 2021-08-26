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

/* eslint-disable no-unused-vars */
const filter = async (req, res) => {
  console.log(req.body);
  res.status(200).send({
    message: 'sj',
  });
};

// Retrieve all posts by owner
router.get('/', getPostsByOwner);
router.post('/filter', filter);

module.exports = router;
