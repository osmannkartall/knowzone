import Joi from 'joi';
import FORM_SCHEMA_CONFIGS from '../form/formSchemaConfigs';
import POST_SCHEMA_CONFIGS from './postSchemaConfigs';
import POST_VALIDATION_MESSAGES from './postValidationMessages';
import VALIDATION_MESSAGES from '../../common/validationMessages';
import validators from '../../common/validators';

const postCreatorSchema = Joi.object({
  id: Joi.string(),

  createdAt: Joi.string(),

  updatedAt: Joi.string(),

  owner: Joi.object(),

  type: Joi.object({
    id: Joi.string().required(),
    name: Joi.string()
      .max(FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE)
      .message(VALIDATION_MESSAGES.MAX_LEN('type.name', FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE))
      .min(FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE)
      .message(VALIDATION_MESSAGES.MIN_LEN('type.name', FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE)),
  }).required(),

  topics: Joi.array()
    .items(
      Joi.string()
        .regex(new RegExp(`^@?([a-z0-9-]){1,${POST_SCHEMA_CONFIGS.MAX_LEN_TOPIC}}$`))
        .message(POST_VALIDATION_MESSAGES.INVALID_TOPIC),
    )
    .required()
    .min(POST_SCHEMA_CONFIGS.MIN_NUM_TOPICS)
    .message(VALIDATION_MESSAGES.MIN_NUM('topics', POST_SCHEMA_CONFIGS.MIN_NUM_TOPICS))
    .max(POST_SCHEMA_CONFIGS.MAX_NUM_TOPICS)
    .message(VALIDATION_MESSAGES.MAX_NUM('topics', POST_SCHEMA_CONFIGS.MAX_NUM_TOPICS)),

  content: Joi.object()
    .unknown()
    .custom((content, helper) => {
      if (!validators.isAnyFieldFilled(content)) {
        return helper.message('at least one content field must be filled');
      }

      if (!validators.isValidMaxLenKeys(content, FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_CONTENT)) {
        return helper.message(
          VALIDATION_MESSAGES.MAX_LEN(
            'content field name',
            FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_CONTENT,
          ),
        );
      }

      return content;
    })
    .required(),
}).required();

export default postCreatorSchema;
