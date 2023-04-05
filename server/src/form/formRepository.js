import BaseRepository from '../common/baseRepository.js';
import FormModel from './form.js';

export default class FormRepository extends BaseRepository {
  constructor() {
    super(FormModel);
  }
}
