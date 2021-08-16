const TipModel = require('../models/Tip');
const BaseRepository = require('./BaseRepository');

class TipsRepository extends BaseRepository {
  constructor() {
    super(TipModel);
  }
}

module.exports = TipsRepository;
