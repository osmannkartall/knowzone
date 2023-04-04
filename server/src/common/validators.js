import VALIDATION_MESSAGES from './validationMessages.js';
import { isArrayUnique } from './utils.js';

function isObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function hasObjectMinNumKey(v, min = 0) {
  return Object.keys(v).length && Object.keys(v).length > min;
}

function isValidMaxNumKey(v, max) {
  return Object.keys(v).length <= max;
}

function validateMinNum(name, min = 0) {
  return {
    validator: (items) => items.length >= min,
    message: VALIDATION_MESSAGES.MIN_NUM(name, min),
  };
}

function validateMaxNum(name, max = 0) {
  return {
    validator: (items) => items.length <= max,
    message: VALIDATION_MESSAGES.MAX_NUM(name, max),
  };
}

function validateArrayUniqueness() {
  return {
    validator: (items) => isArrayUnique(items),
    message: VALIDATION_MESSAGES.DUPLICATED_ITEMS,
  };
}

function isAnyFieldFilled(object) {
  return Object.values(object).some(
    (field) => (Array.isArray(field) ? field.length : field || false),
  );
}

function isValidMaxLenKeys(object, max = 0) {
  return Object.keys(object).every((k) => k?.length <= max);
}

export default {
  isObject,
  hasObjectMinNumKey,
  isValidMaxNumKey,
  validateMinNum,
  validateMaxNum,
  validateArrayUniqueness,
  isAnyFieldFilled,
  isValidMaxLenKeys,
};
