import { Schema } from 'mongoose';
import FORM_SCHEMA_CONFIGS from './formSchemaConfigs.js';
import VALIDATION_MESSAGES from '../common/validationMessages.js';

const type = {
  id: {
    type: Schema.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
    maxLength: [
      FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE,
      VALIDATION_MESSAGES.MAX_LEN('type.name', FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE),
    ],
    minLength: [
      FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE,
      VALIDATION_MESSAGES.MIN_LEN('type.name', FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE),
    ],
  },
};

export default type;
