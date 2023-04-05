const BaseRepository = require('../common/baseRepository');
const FormModel = require('./form');

class FormRepository extends BaseRepository {
  constructor() {
    super(FormModel);
  }
}

module.exports = FormRepository;
