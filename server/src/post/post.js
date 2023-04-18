import { Schema, model } from 'mongoose';
import { transformToJSON } from '../common/utils.js';
import Form from '../form/form.js';
import owner from '../form/owner.js';
import type from '../form/type.js';
import FORM_SCHEMA_CONFIGS from '../form/formSchemaConfigs.js';
import POST_SCHEMA_CONFIGS from './postSchemaConfigs.js';
import VALIDATION_MESSAGES from '../common/validationMessages.js';
import POST_VALIDATION_MESSAGES from './postValidationMessages.js';
import validators from '../common/validators.js';
import postValidators from './postValidators.js';

async function getFormOfPostOrInvalidate(post) {
  const formRecord = await Form.findOne(
    { type: post.type, 'owner.id': post.owner.id },
    { type: 0, createdAt: 0, updatedAt: 0 },
  );

  if (!formRecord) {
    throw new Error(VALIDATION_MESSAGES.NO_RECORD('form'));
  }

  return formRecord;
}

const postSchema = new Schema(
  {
    owner,
    type,
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
        validators.validateMinNum('topics', POST_SCHEMA_CONFIGS.MIN_NUM_TOPICS),
        validators.validateMaxNum('topics', POST_SCHEMA_CONFIGS.MAX_NUM_TOPICS),
        validators.validateArrayUniqueness(),
      ],
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
            return validators.isValidMaxNumKey(content, FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT);
          },
          message: VALIDATION_MESSAGES.MAX_KEY('content', FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT),
        },
        {
          async validator(content) {
            const formRecord = await getFormOfPostOrInvalidate(this);

            if (!validators.hasObjectMinNumKey(content)) {
              throw new Error(
                VALIDATION_MESSAGES.MIN_KEY('content', FORM_SCHEMA_CONFIGS.MIN_NUM_CONTENT),
              );
            }

            postValidators.validateContentFields(content, formRecord);

            postValidators.validateValueOfContentFields(content, formRecord);

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
        validate: validators.validateMaxNum('images', POST_SCHEMA_CONFIGS.MAX_NUM_IMAGES),
      },
    },
  },
  { timestamps: true },
);

postSchema.index({ '$**': 'text' });
postSchema.index({ createdAt: -1 });
postSchema.index({ topics: 1 });

transformToJSON(postSchema);

export default model('post', postSchema);
