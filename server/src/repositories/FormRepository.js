const FormModel = require('../models/Form');
const BaseRepository = require('./BaseRepository');

class FormRepository extends BaseRepository {
  constructor() {
    super(FormModel);
  }
}

module.exports = FormRepository;
