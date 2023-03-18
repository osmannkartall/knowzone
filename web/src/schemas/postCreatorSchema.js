import Joi from 'joi';
import { POST_SCHEMA_CONFIGS } from './schemaConfigs';

const postCreatorSchema = Joi.object({
  id: Joi.string(),
  createdAt: Joi.string(),
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
          .message(
            [
              `A topic should be at most ${POST_SCHEMA_CONFIGS.MAX_LEN_TOPIC}`,
              'alphanumeric characters and it may also contain hyphen.',
            ].join(' '),
          ),
      )
      .required()
      .min(POST_SCHEMA_CONFIGS.MIN_NUM_TOPICS)
      .message('at least one topic must be added')
      .max(POST_SCHEMA_CONFIGS.MAX_NUM_TOPICS),
  content:
    Joi.object()
      .unknown()
      .custom((content, helper) => {
        const isAnyFieldFilled = Object.values(content).some(
          (field) => (Array.isArray(field) ? field.length : field || false),
        );

        if (!isAnyFieldFilled) {
          return helper.message('at least one content field must be filled');
        }

        return content;
      })
      .required(),
}).required();

export default postCreatorSchema;
