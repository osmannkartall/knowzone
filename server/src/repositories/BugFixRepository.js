const BugFixModel = require('../models/BugFix');
const BaseRepository = require('./BaseRepository');

class BugFixRepository extends BaseRepository {
  constructor() {
    super(BugFixModel);
  }
}

module.exports = BugFixRepository;
