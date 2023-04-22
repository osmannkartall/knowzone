import { Schema, model } from 'mongoose';
import { transformToJSON } from '../common/utils.js';
import owner from './owner.js';
import type from './type.js';
import FORM_SCHEMA_CONFIGS from './formSchemaConfigs.js';
import VALIDATION_MESSAGES from '../common/validationMessages.js';
import FORM_VALIDATION_MESSAGES from './formValidationMessages.js';
import validators from '../common/validators.js';
import formValidators from './formValidators.js';

const formSchema = Schema(
  {
    owner,
    type,
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

transformToJSON(formSchema);

formSchema.index({ createdAt: -1 });

export default model('form', formSchema);
