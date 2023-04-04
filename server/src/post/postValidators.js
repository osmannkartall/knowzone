import FORM_COMPONENT_TYPES from '../form/formComponentTypes.js';
import POST_SCHEMA_CONFIGS from './postSchemaConfigs.js';
import VALIDATION_MESSAGES from '../common/validationMessages.js';
import POST_VALIDATION_MESSAGES from './postValidationMessages.js';

function validateContentFields(content, formRecord) {
  const formContent = Object.keys(formRecord.content);
  const postContent = Object.keys(content);
  const invalidFields = postContent.filter((f) => !formContent.includes(f));

  if (invalidFields.length > 0) {
    throw new Error(`${POST_VALIDATION_MESSAGES.INVALID_FIELD}: ${invalidFields.join(', ')}`);
  }
}

function validateTextValue(key, value) {
  const messages = [];

  if (value === null || typeof value === 'object' || Array.isArray(value)) {
    messages.push(POST_VALIDATION_MESSAGES.VALUE(
      key,
      FORM_COMPONENT_TYPES.TEXT,
      'string, number or boolean',
    ));
  }

  if (value?.length > POST_SCHEMA_CONFIGS.MAX_LEN_TEXT) {
    messages.push(VALIDATION_MESSAGES.MAX_LEN(key, POST_SCHEMA_CONFIGS.MAX_LEN_TEXT));
  }

  if (value?.length < POST_SCHEMA_CONFIGS.MIN_LEN_TEXT) {
    messages.push(VALIDATION_MESSAGES.MIN_LEN(key, POST_SCHEMA_CONFIGS.MIN_LEN_TEXT));
  }

  return messages;
}

function validateListValue(key, value) {
  const messages = [];

  if (!Array.isArray(value)) {
    messages.push(POST_VALIDATION_MESSAGES.VALUE(key, FORM_COMPONENT_TYPES.LIST, 'array'));
  }

  if (value?.length > POST_SCHEMA_CONFIGS.MAX_NUM_LIST) {
    messages.push(VALIDATION_MESSAGES.MAX_NUM(key, POST_SCHEMA_CONFIGS.MAX_NUM_LIST));
  }

  return messages;
}

function validateEditorValue(key, value) {
  const messages = [];

  if (value === null || typeof value === 'object' || Array.isArray(value)) {
    messages.push(
      POST_VALIDATION_MESSAGES.VALUE(
        key,
        FORM_COMPONENT_TYPES.EDITOR,
        'string, number or boolean',
      ),
    );
  }

  if (value?.length > POST_SCHEMA_CONFIGS.MAX_LEN_EDITOR) {
    messages.push(VALIDATION_MESSAGES.MAX_LEN(key, POST_SCHEMA_CONFIGS.MAX_LEN_EDITOR));
  }

  if (value?.length < POST_SCHEMA_CONFIGS.MIN_LEN_EDITOR) {
    messages.push(VALIDATION_MESSAGES.MIN_LEN(key, POST_SCHEMA_CONFIGS.MIN_LEN_EDITOR));
  }

  return messages;
}

function validateValueOfContentFields(content, formRecord) {
  let messages = [];

  Object.entries(content).forEach(([key, value]) => {
    if (formRecord.content[key] === FORM_COMPONENT_TYPES.TEXT) {
      messages = messages.concat(validateTextValue(key, value));
    } else if (formRecord.content[key] === FORM_COMPONENT_TYPES.LIST) {
      messages = messages.concat(validateListValue(key, value));
    } else if (formRecord.content[key] === FORM_COMPONENT_TYPES.EDITOR) {
      messages = messages.concat(validateEditorValue(key, value));
    }
  });

  if (messages.length) {
    throw new Error(messages.join(', '));
  }
}

export default {
  validateContentFields,
  validateValueOfContentFields,
};
