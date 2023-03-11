const { Schema, model } = require('mongoose');
const { transformToJSON } = require('../utils');
const owner = require('./Owner');
const SCHEMA_CONFIGS = require('./schemaConfigs');

const COMPONENT_TYPES = ['text', 'list', 'editor', 'image'];

const FormSchema = Schema(
  {
    owner,
    type: {
      type: String,
      required: true,
      unique: true,
      maxLength: [SCHEMA_CONFIGS.MAX_LEN_TYPE, `length of type can not be longer than ${SCHEMA_CONFIGS.MAX_LEN_TYPE}`],
      minLength: [SCHEMA_CONFIGS.MIN_LEN_TYPE, `length of type can not be smaller than ${SCHEMA_CONFIGS.MIN_LEN_TYPE}`],
    },
    fields: {
      type: Schema.Types.Mixed,
      required: true,
      validate: [
        {
          validator(v) {
            return v !== null && typeof v === 'object' && !Array.isArray(v);
          },
          message: 'fields must be object',
        },
        {
          validator(v) {
            return Object.keys(v).length;
          },
          message: 'fields must have at least 1 key',
        },
        {
          validator(v) {
            return Object.keys(v).length <= SCHEMA_CONFIGS.MAX_NUM_FIELD;
          },
          message: `fields must have at most ${SCHEMA_CONFIGS.MAX_NUM_FIELD} keys`,
        },
        {
          validator(v) {
            const isAnyInvalidKeyOrValue = Object.entries(v).some(([key, value]) => (
              (typeof key !== 'string' || key.length === 0) // This might be redundant
                || (typeof value !== 'string' || value.length === 0)
                || (!COMPONENT_TYPES.includes(value)
                || (key.length > SCHEMA_CONFIGS.MAX_LEN_KEY_OF_FIELDS))
            ));

            return !isAnyInvalidKeyOrValue;
          },
          message: `name and component type must be non-empty string. Valid component types are: ${COMPONENT_TYPES.join(', ')}. name cannot be longer than ${SCHEMA_CONFIGS.MAX_LEN_KEY_OF_FIELDS}.`,
        },
      ],
    },
  },
  { timestamps: true },
);

transformToJSON(FormSchema);

const Form = model('Form', FormSchema);

module.exports = Form;
