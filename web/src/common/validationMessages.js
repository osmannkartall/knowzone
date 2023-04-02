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

export default VALIDATION_MESSAGES;
