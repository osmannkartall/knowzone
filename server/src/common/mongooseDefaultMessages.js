const MONGOOSE_DEFAULT_MESSAGES = Object.freeze({
  REQUIRED: (field) => `Path \`${field}\` is required`,
  INVALID: (schema, field = '') => `${schema} validation failed: ${field}`,
  CAST: (type) => `Cast to ${type} failed for value`,
});

module.exports = MONGOOSE_DEFAULT_MESSAGES;
