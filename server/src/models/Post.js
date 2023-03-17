const { Schema, model, Error } = require('mongoose');
const FORM_COMPONENT_TYPES = require('../constants/formComponentTypes');
const { isArrayUnique, transformToJSON } = require('../utils');
const Form = require('./Form');
const owner = require('./Owner');
const { FORM_SCHEMA_CONFIGS, POST_SCHEMA_CONFIGS } = require('./schemaConfigs');
const { VALIDATION_MESSAGES, POST_VALIDATION_MESSAGES } = require('./validationMessages');

const validateMinNum = (name, min = 0) => ({
  validator: (items) => items.length >= min,
  message: VALIDATION_MESSAGES.MIN_NUM(name, min),
});

const validateMaxNum = (name, max = 0) => ({
  validator: (items) => items.length <= max,
  message: VALIDATION_MESSAGES.MAX_NUM(name, max),
});

const validateArrayUniqueness = () => ({
  validator: (items) => isArrayUnique(items),
  message: VALIDATION_MESSAGES.DUPLICATED_ITEMS,
});

const validateContentFields = (content, formRecord) => {
  const formFields = Object.keys(formRecord.fields);
  const postFields = Object.keys(content);
  const invalidFields = postFields.filter((f) => !formFields.includes(f));

  if (invalidFields.length > 0) {
    throw new Error(`${POST_VALIDATION_MESSAGES.INVALID_FIELD}: ${invalidFields.join(', ')}`);
  }
};

const validateValueOfContentFields = (content, formRecord) => {
  const messages = [];
  let isAnyInvalidValue = false;

  Object.entries(content).forEach(([key, value]) => {
    if (formRecord.fields[key] === FORM_COMPONENT_TYPES.TEXT) {
      if (value === null || typeof value === 'object' || Array.isArray(value)) {
        messages.push(POST_VALIDATION_MESSAGES.VALUE(
          key,
          FORM_COMPONENT_TYPES.TEXT,
          'string, number or boolean',
        ));
        isAnyInvalidValue = true;
      }

      if (value?.length > POST_SCHEMA_CONFIGS.MAX_LEN_TEXT) {
        messages.push(VALIDATION_MESSAGES.MAX_LEN(key, POST_SCHEMA_CONFIGS.MAX_LEN_TEXT));
        isAnyInvalidValue = true;
      }

      if (value?.length < POST_SCHEMA_CONFIGS.MIN_LEN_TEXT) {
        messages.push(VALIDATION_MESSAGES.MIN_LEN(key, POST_SCHEMA_CONFIGS.MIN_LEN_TEXT));
        isAnyInvalidValue = true;
      }
    } else if (formRecord.fields[key] === FORM_COMPONENT_TYPES.LIST) {
      if (!Array.isArray(value)) {
        messages.push(POST_VALIDATION_MESSAGES.VALUE(key, FORM_COMPONENT_TYPES.LIST, 'array'));
        isAnyInvalidValue = true;
      }

      if (value?.length > POST_SCHEMA_CONFIGS.MAX_NUM_LIST) {
        messages.push(VALIDATION_MESSAGES.MAX_NUM(key, POST_SCHEMA_CONFIGS.MAX_NUM_LIST));
        isAnyInvalidValue = true;
      }
    } else if (formRecord.fields[key] === FORM_COMPONENT_TYPES.EDITOR) {
      if (value === null || typeof value === 'object' || Array.isArray(value)) {
        messages.push(POST_VALIDATION_MESSAGES.VALUE(
          key,
          FORM_COMPONENT_TYPES.EDITOR,
          'string, number or boolean',
        ));
        isAnyInvalidValue = true;
      }

      if (value?.length > POST_SCHEMA_CONFIGS.MAX_LEN_EDITOR) {
        messages.push(VALIDATION_MESSAGES.MAX_LEN(key, POST_SCHEMA_CONFIGS.MAX_LEN_EDITOR));
        isAnyInvalidValue = true;
      }

      if (value?.length < POST_SCHEMA_CONFIGS.MIN_LEN_EDITOR) {
        messages.push(VALIDATION_MESSAGES.MIN_LEN(key, POST_SCHEMA_CONFIGS.MIN_LEN_EDITOR));
        isAnyInvalidValue = true;
      }
    }
  });

  if (isAnyInvalidValue) {
    throw new Error(messages.join(', '));
  }
};

const PostSchema = new Schema(
  {
    owner,
    type: {
      type: String,
      required: true,
      maxLength: [
        FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE,
        VALIDATION_MESSAGES.MAX_LEN('type', FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE),
      ],
      minLength: [
        FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE,
        VALIDATION_MESSAGES.MIN_LEN('type', FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE),
      ],
    },
    topics: {
      type: [
        {
          type: String,
          // TODO: it should not be only ascii.
          match: [
            new RegExp(`^@?([a-z0-9-]){1,${POST_SCHEMA_CONFIGS.MAX_LEN_TOPIC}}$`),
            POST_VALIDATION_MESSAGES.INVALID_TOPIC,
          ],
          lowercase: true,
        },
      ],
      required: true,
      validate: [
        validateMinNum('topics', POST_SCHEMA_CONFIGS.MIN_NUM_TOPICS),
        validateMaxNum('topics', POST_SCHEMA_CONFIGS.MAX_NUM_TOPICS),
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
          message: VALIDATION_MESSAGES.TYPE('content', 'object'),
        },
        {
          validator(v) {
            return Object.keys(v).length <= FORM_SCHEMA_CONFIGS.MAX_NUM_FIELD;
          },
          message: VALIDATION_MESSAGES.MAX_KEY('content', FORM_SCHEMA_CONFIGS.MAX_NUM_FIELD),
        },
        {
          async validator(v) {
            const formRecord = await Form.findOne(
              { type: this.type, 'owner.id': this.owner.id },
              { type: 0, createdAt: 0, updatedAt: 0 },
            );

            if (!formRecord) {
              throw new Error(VALIDATION_MESSAGES.NO_RECORD('form'));
            }

            if (!formRecord.fields.images) {
              delete v.images;
            }

            if (!Object.keys(v).length) {
              throw new Error(
                VALIDATION_MESSAGES.MIN_KEY('content', FORM_SCHEMA_CONFIGS.MIN_NUM_FIELD),
              );
            }

            validateContentFields(v, formRecord);

            validateValueOfContentFields(v, formRecord);

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
        validate: validateMaxNum('images', POST_SCHEMA_CONFIGS.MAX_NUM_IMAGES),
      },
    },
  },
  { timestamps: true },
);

transformToJSON(PostSchema);

const Post = model('Post', PostSchema);

module.exports = Post;
