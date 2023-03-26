const { FORM_SCHEMA_CONFIGS } = require('./schemaConfigs');
const { VALIDATION_MESSAGES } = require('./validationMessages');

const type = {
  type: String,
  required: true,
  maxLength: [
    FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE,
    VALIDATION_MESSAGES.MAX_LEN('type', FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE),
  ],
  minLength: [
    FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE,
    VALIDATION_MESSAGES.MIN_LEN('type', FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE),
  ],
};

module.exports = type;
