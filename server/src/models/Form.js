const { Schema, model } = require('mongoose');
const { transformToJSON } = require('../utils');
const owner = require('./Owner');
const type = require('./Type');
const { FORM_SCHEMA_CONFIGS } = require('./schemaConfigs');
const { VALIDATION_MESSAGES, FORM_VALIDATION_MESSAGES } = require('./validationMessages');
const validators = require('../validators');
const formValidators = require('./formValidators');

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
            return validators.isObject(content);
          },
          message: VALIDATION_MESSAGES.TYPE('content', 'object'),
        },
        {
          validator(content) {
            return validators.hasObjectMinNumKey(content);
          },
          message: VALIDATION_MESSAGES.MIN_KEY('content', FORM_SCHEMA_CONFIGS.MIN_NUM_CONTENT),
        },
        {
          validator(content) {
            return validators.isValidMaxNumKey(content, FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT);
          },
          message: VALIDATION_MESSAGES.MAX_KEY('content', FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT),
        },
        {
          validator(content) {
            return formValidators.isAllValidKeyValue(content);
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
            return formValidators.isValidMaxNumImageComponent(content);
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
