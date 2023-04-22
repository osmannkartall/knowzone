import Joi from 'joi';
import FORM_COMPONENT_TYPES from './formComponentTypes';
import FORM_SCHEMA_CONFIGS from './formSchemaConfigs';
import VALIDATION_MESSAGES from '../../common/validationMessages';

const formCreatorSchema = Joi.object({
  type: Joi.object({
    id: Joi.string(),
    name: Joi.string()
      .max(FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE)
      .message(VALIDATION_MESSAGES.MAX_LEN('type.name', FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE))
      .min(FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE)
      .message(VALIDATION_MESSAGES.MIN_LEN('type.name', FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE))
      .required(),
  }).required(),

  content: Joi.object()
    .unknown()
    .custom((content, helper) => {
      const contentKeys = [];

      Object.values(content).forEach((f) => {
        if (f.type === FORM_COMPONENT_TYPES.IMAGE) {
          // TODO: can't we automate this process with setValue from react-hook-form
          contentKeys.push('images');
        } else if (f.name && f.type) {
          contentKeys.push(f.name);
        }
      });

      if (!contentKeys.length) {
        return helper.message('At least one name and type required.');
      }

      if (contentKeys.length !== new Set(contentKeys).size) {
        return helper.message('Each name of form field must be unique');
      }

      return content;
    })
    .required(),
}).required();

export default formCreatorSchema;
