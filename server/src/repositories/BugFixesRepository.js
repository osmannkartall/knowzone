const BugFixModel = require('../models/BugFixes');

const BaseRepository = require('./BaseRepository');

class BugFixesRepository extends BaseRepository {
  constructor() {
    super(BugFixModel);
  }
}

module.exports = BugFixesRepository;
