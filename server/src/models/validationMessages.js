const COMPONENT_TYPES = require('../constants/componentTypes');
const { POST_SCHEMA_CONFIGS } = require('./schemaConfigs');

const VALIDATION_MESSAGES = Object.freeze({
  TYPE: (field, type) => `${field} must be ${type}`,
  MIN_LEN: (field, len = 0) => `length of ${field} cannot be smaller than ${len}`,
  MAX_LEN: (field, len) => `length of ${field} cannot be longer than ${len}`,
  MIN_NUM: (field, num = 0) => `number of ${field} cannot be less than ${num}`,
  MAX_NUM: (field, num) => `number of ${field} cannot be greater than ${num}`,
  MIN_KEY: (field, num) => `${field} must have at least ${num} key`,
  MAX_KEY: (field, num) => `${field} must have at most ${num} key`,
  NO_RECORD: (field) => `${field} record not found for the given type`,
  DUPLICATED_ITEMS: 'Array cannot have duplicated items',
});

const MONGOOSE_DEFAULT_MESSAGES = Object.freeze({
  REQUIRED: (field) => `Path \`${field}\` is required`,
  INVALID: (schema, field = '') => `${schema} validation failed: ${field}`,
  CAST: (type) => `Cast to ${type} failed for value`,
});

const FORM_VALIDATION_MESSAGES = Object.freeze({
  MAX_IMAGE_COMPONENT: 'fields must have at most one image component',
  INVALID_COMPONENT: `Valid component types are: ${Object.values(COMPONENT_TYPES).join(', ')}`,
});

const POST_VALIDATION_MESSAGES = Object.freeze({
  VALUE: (field, comp, type) => `value of ${field} ${comp} must be ${type}`,
  INVALID_FIELD: 'invalid fields for form type',
  INVALID_TOPIC: [
    `A topic should be at most ${POST_SCHEMA_CONFIGS.MAX_LEN_TOPIC}`,
    'alphanumeric characters and it may also contain hyphen.',
  ].join(' '),
});

module.exports = {
  VALIDATION_MESSAGES,
  MONGOOSE_DEFAULT_MESSAGES,
  FORM_VALIDATION_MESSAGES,
  POST_VALIDATION_MESSAGES,
};
