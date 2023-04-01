const POST_SCHEMA_CONFIGS = require('./postSchemaConfigs');

const POST_VALIDATION_MESSAGES = Object.freeze({
  VALUE: (field, comp, type) => `value of ${field} ${comp} must be ${type}`,
  INVALID_FIELD: 'invalid fields for form type',
  INVALID_TOPIC: [
    `A topic should be at most ${POST_SCHEMA_CONFIGS.MAX_LEN_TOPIC}`,
    'alphanumeric characters and it may also contain hyphen.',
  ].join(' '),
});

module.exports = POST_VALIDATION_MESSAGES;
