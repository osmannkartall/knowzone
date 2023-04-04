import POST_SCHEMA_CONFIGS from './postSchemaConfigs.js';

const POST_VALIDATION_MESSAGES = Object.freeze({
  VALUE: (field, comp, type) => `value of ${field} ${comp} must be ${type}`,
  INVALID_FIELD: 'invalid fields for form type',
  INVALID_TOPIC: [
    `A topic should be at most ${POST_SCHEMA_CONFIGS.MAX_LEN_TOPIC}`,
    'alphanumeric characters and it may also contain hyphen.',
  ].join(' '),
});

export default POST_VALIDATION_MESSAGES;
