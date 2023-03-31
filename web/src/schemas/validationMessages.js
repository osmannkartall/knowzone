import FORM_COMPONENT_TYPES from '../constants/form-components-types';
import { POST_SCHEMA_CONFIGS } from './schemaConfigs';

export const VALIDATION_MESSAGES = Object.freeze({
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

export const FORM_VALIDATION_MESSAGES = Object.freeze({
  MAX_IMAGE_COMPONENT: 'content must have at most one image component',
  INVALID_COMPONENT: `Valid component types are: ${Object.values(FORM_COMPONENT_TYPES).join(', ')}`,
});

export const POST_VALIDATION_MESSAGES = Object.freeze({
  VALUE: (field, comp, type) => `value of ${field} ${comp} must be ${type}`,
  INVALID_FIELD: 'invalid fields for form type',
  INVALID_TOPIC: [
    `A topic should be at most ${POST_SCHEMA_CONFIGS.MAX_LEN_TOPIC}`,
    'alphanumeric characters and it may also contain hyphen.',
  ].join(' '),
});
