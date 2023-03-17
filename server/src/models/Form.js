const { Schema, model } = require('mongoose');
const FORM_COMPONENT_TYPES = require('../constants/formComponentTypes');
const { transformToJSON } = require('../utils');
const owner = require('./Owner');
const { FORM_SCHEMA_CONFIGS } = require('./schemaConfigs');
const { VALIDATION_MESSAGES, FORM_VALIDATION_MESSAGES } = require('./validationMessages');

let numImageComponent = 0;

const FormSchema = Schema(
  {
    owner,
    type: {
      type: String,
      required: true,
      unique: true,
      maxLength: [
        FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE,
        VALIDATION_MESSAGES.MAX_LEN('type', FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE),
      ],
      minLength: [
        FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE,
        VALIDATION_MESSAGES.MIN_LEN('type', FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE),
      ],
    },
    fields: {
      type: Schema.Types.Mixed,
      required: true,
      validate: [
        {
          validator(v) {
            return v !== null && typeof v === 'object' && !Array.isArray(v);
          },
          message: VALIDATION_MESSAGES.TYPE('fields', 'object'),
        },
        {
          validator(v) {
            return Object.keys(v).length;
          },
          message: VALIDATION_MESSAGES.MIN_KEY('fields', FORM_SCHEMA_CONFIGS.MIN_NUM_FIELD),
        },
        {
          validator(v) {
            return Object.keys(v).length <= FORM_SCHEMA_CONFIGS.MAX_NUM_FIELD;
          },
          message: VALIDATION_MESSAGES.MAX_KEY('fields', FORM_SCHEMA_CONFIGS.MAX_NUM_FIELD),
        },
        {
          validator(v) {
            numImageComponent = 0;
            const isAnyInvalidKeyOrValue = Object.entries(v).some(([key, value]) => {
              if (value === 'image') {
                numImageComponent += 1;
              }

              return (
                (typeof value !== 'string' || value.length === 0)
                || (!Object.values(FORM_COMPONENT_TYPES).includes(value)
                || (key.length > FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_FIELDS))
              );
            });

            return !isAnyInvalidKeyOrValue;
          },
          message: [
            VALIDATION_MESSAGES.MIN_LEN('name'),
            VALIDATION_MESSAGES.MAX_LEN('name', FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_FIELDS),
            VALIDATION_MESSAGES.MIN_LEN('component type'),
            FORM_VALIDATION_MESSAGES.INVALID_COMPONENT,
          ].join('. '),
        },
        {
          validator() {
            return numImageComponent <= FORM_SCHEMA_CONFIGS.MAX_IMAGE_COMP;
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
