const BugFixesModel = require('../models/BugFixes');

const BaseRepository = require('./BaseRepository');

class BugFixesRepository extends BaseRepository {
  constructor() {
    super(BugFixesModel);
  }
}

module.exports = BugFixesRepository;
