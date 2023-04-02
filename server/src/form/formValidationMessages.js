const FORM_COMPONENT_TYPES = require('./formComponentTypes');

const FORM_VALIDATION_MESSAGES = Object.freeze({
  MAX_IMAGE_COMPONENT: 'content must have at most one image component',
  INVALID_COMPONENT: `Valid component types are: ${Object.values(FORM_COMPONENT_TYPES).join(', ')}`,
});

module.exports = FORM_VALIDATION_MESSAGES;
