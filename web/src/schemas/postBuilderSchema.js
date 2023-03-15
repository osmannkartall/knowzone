import Joi from 'joi';
import { POST_SCHEMA_CONFIGS } from './schemaConfigs';

const postBuilderSchema = Joi.object({
  id: Joi.string(),
  createdAt: Joi.string(),
  modifiedAt: Joi.string(),
  updatedAt: Joi.string(),
  owner: Joi.object(),
  type:
    Joi.string()
      .required(),
  topics:
    Joi.array()
      .items(
        Joi.string()
          .regex(new RegExp(`^@?([a-z0-9-]){1,${POST_SCHEMA_CONFIGS.MAX_LEN_TOPIC}}$`))
          .message(`Invalid topic(s). A topic should be at most ${POST_SCHEMA_CONFIGS.MAX_LEN_TOPIC} alphanumeric characters and it may also contain hyphen.`),
      )
      .required()
      .min(POST_SCHEMA_CONFIGS.MIN_NUM_TOPICS)
      .max(POST_SCHEMA_CONFIGS.MAX_NUM_TOPICS),
  content:
    Joi.object()
      .unknown()
      .custom(({ images, ...content }, helper) => {
        const isAnyFieldFilled = Object.values(content).some(
          (field) => (Array.isArray(field) ? field.length : field || false),
        );

        return !isAnyFieldFilled ? helper.message('at least one content field must be filled') : true;
      })
      .required(),
}).required();

export default postBuilderSchema;
