const BugfixModel = require('../models/Bugfix');
const BaseRepository = require('./BaseRepository');

class BugfixRepository extends BaseRepository {
  constructor() {
    super(BugfixModel);
  }
}

module.exports = BugfixRepository;
