const { Schema, model } = require('mongoose');
const { transformToJSON } = require('../utils');
const owner = require('./Owner');
const type = require('./Type');
const { FORM_SCHEMA_CONFIGS } = require('./schemaConfigs');
const { VALIDATION_MESSAGES, FORM_VALIDATION_MESSAGES } = require('./validationMessages');
const { isObject, hasObjectKey, isValidMaxNumKey } = require('../validators');
const { isAnyInvalidKeyOrValue, isValidMaxNumImageComponent } = require('./formValidators');

const FormSchema = Schema(
  {
    owner,
    type: {
      ...type,
      unique: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
      validate: [
        {
          validator(content) {
            return isObject(content);
          },
          message: VALIDATION_MESSAGES.TYPE('content', 'object'),
        },
        {
          validator(content) {
            return hasObjectKey(content);
          },
          message: VALIDATION_MESSAGES.MIN_KEY('content', FORM_SCHEMA_CONFIGS.MIN_NUM_CONTENT),
        },
        {
          validator(content) {
            return isValidMaxNumKey(content, FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT);
          },
          message: VALIDATION_MESSAGES.MAX_KEY('content', FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT),
        },
        {
          validator(content) {
            return !isAnyInvalidKeyOrValue(content);
          },
          message: [
            VALIDATION_MESSAGES.MIN_LEN('name'),
            VALIDATION_MESSAGES.MAX_LEN('name', FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_CONTENT),
            VALIDATION_MESSAGES.MIN_LEN('component type'),
            FORM_VALIDATION_MESSAGES.INVALID_COMPONENT,
          ].join('. '),
        },
        {
          validator(content) {
            return isValidMaxNumImageComponent(content);
          },
          message: FORM_VALIDATION_MESSAGES.MAX_IMAGE_COMPONENT,
        },
      ],
    },
  },
  { timestamps: true },
);

transformToJSON(FormSchema);

const Form = model('Form', FormSchema);

module.exports = Form;
