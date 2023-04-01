const FormModel = require('./Form');
const BaseRepository = require('../common/BaseRepository');

class FormRepository extends BaseRepository {
  constructor() {
    super(FormModel);
  }
}

module.exports = FormRepository;
