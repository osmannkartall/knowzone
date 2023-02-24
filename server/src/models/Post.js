const { Schema, model, Error } = require('mongoose');
const { isLengthBetween, isArrayUnique, transformToJSON } = require('../utils');
const Form = require('./Form');
const SCHEMA_CONFIGS = require('./schemaConfigs');

const MAX_NUM_TOPICS = 5;
const MIN_NUM_TOPICS = 1;
const MAX_NUM_IMAGES = 2;
const MAX_LEN_TEXT = 100;
const MIN_LEN_TEXT = 1;
const MAX_LEN_EDITOR = 100;
const MIN_LEN_EDITOR = 1;
const MAX_SIZE_LIST = 5;

const validateArrayLength = (name, max, min = 0) => ({
  validator: (items) => isLengthBetween(items, max, min),
  message: (props) => `Number of ${name} should be in [${min}, ${max}], RECEIVED: ${props.value.length}`,
});

const validateArrayUniqueness = () => ({
  validator: (items) => isArrayUnique(items),
  message: 'Array cannot have duplicated items, RECEIVED: [{VALUE}]',
});

const PostSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      maxLength: [SCHEMA_CONFIGS.MAX_LEN_TYPE, `length of type can not be longer than ${SCHEMA_CONFIGS.MAX_LEN_TYPE}`],
      minLength: [SCHEMA_CONFIGS.MIN_LEN_TYPE, `length of type can not be smaller than ${SCHEMA_CONFIGS.MIN_LEN_TYPE}`],
    },
    topics: {
      type: [
        {
          type: String,
          // TODO: it should not be only ascii.
          match: /^@?([a-z0-9-]){1,30}$/,
          lowercase: true,
        },
      ],
      required: true,
      validate: [
        validateArrayLength('topics', MAX_NUM_TOPICS, MIN_NUM_TOPICS),
        validateArrayUniqueness(),
      ],
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
      validate: [
        {
          validator(v) {
            return v !== null && typeof v === 'object' && !Array.isArray(v);
          },
          message: 'content must be object',
        },
        {
          validator(v) {
            return Object.keys(v).length;
          },
          message: 'content must have at least 1 key',
        },
        {
          validator(v) {
            return Object.keys(v).length <= SCHEMA_CONFIGS.MAX_NUM_FIELD;
          },
          message: `content must have at most ${SCHEMA_CONFIGS.MAX_NUM_FIELD} keys`,
        },
        {
          async validator(v) {
            const formRecord = await Form.findOne(
              { type: this.type },
              { type: 0, createdAt: 0, updatedAt: 0 },
            );

            if (!formRecord) {
              throw new Error(`form record not found for the given type: ${this.type}`);
            }

            if (!formRecord.fields.images) {
              delete v.images;
            }

            const formFields = Object.keys(formRecord.fields);
            const postFields = Object.keys(v);
            const invalidFields = postFields.filter((f) => !formFields.includes(f));

            if (invalidFields.length > 0) {
              throw new Error(`invalid fields for form type: ${invalidFields.join(', ')}`);
            }

            const messages = [];
            let isAnyInvalidValue = false;

            Object.entries(v).forEach(([key, value]) => {
              if (formRecord.fields[key] === 'text') {
                if (value === null || typeof value === 'object' || Array.isArray(value)) {
                  messages.push(`invalid value for text type field ${key}. Value can be string, number or boolean`);
                  isAnyInvalidValue = true;
                }

                if (value?.length > MAX_LEN_TEXT) {
                  messages.push(`length of value of a text type field can't be longer than ${MAX_LEN_TEXT}`);
                  isAnyInvalidValue = true;
                }

                if (value?.length < MIN_LEN_TEXT) {
                  messages.push(`length of a value of a text type field can't be smaller than ${MIN_LEN_TEXT}`);
                  isAnyInvalidValue = true;
                }
              } else if (formRecord.fields[key] === 'list') {
                if (!Array.isArray(value)) {
                  messages.push('value of a list type field must be array');
                  isAnyInvalidValue = true;
                }

                if (value?.length > MAX_SIZE_LIST) {
                  messages.push(`number of elements in a list type field can't be greater than ${MAX_SIZE_LIST}`);
                  isAnyInvalidValue = true;
                }
              } else if (formRecord.fields[key] === 'editor') {
                if (value === null || typeof value === 'object' || Array.isArray(value)) {
                  messages.push(`invalid value for editor type field ${key}. Value can be string, number or boolean`);
                  isAnyInvalidValue = true;
                }

                if (value?.length > MAX_LEN_EDITOR) {
                  messages.push(`length of value of a editor type field can't be longer than ${MAX_LEN_EDITOR}`);
                  isAnyInvalidValue = true;
                }

                if (value?.length < MIN_LEN_EDITOR) {
                  messages.push(`length of a value of a editor type field can't be smaller than ${MIN_LEN_EDITOR}`);
                  isAnyInvalidValue = true;
                }
              }
            });

            if (isAnyInvalidValue) {
              throw new Error(messages.join(', '));
            }

            return true;
          },
        },
      ],
      images: {
        type: [
          {
            name: String,
            path: {
              type: String,
              required: true,
            },
          },
        ],
        validate: validateArrayLength('images', MAX_NUM_IMAGES),
      },
    },
  },
  { timestamps: true },
);

transformToJSON(PostSchema);

const Post = model('Post', PostSchema);

module.exports = Post;
