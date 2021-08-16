const HelloModel = require('../models/Hello');
const BaseRepository = require('./BaseRepository');

class HelloRepository extends BaseRepository {
  constructor() {
    super(HelloModel);
  }
}

module.exports = HelloRepository;
