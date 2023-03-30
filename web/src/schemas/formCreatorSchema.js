import Joi from 'joi';
import FORM_COMPONENT_TYPES from '../constants/form-components-types';

const formCreatorSchema = Joi.object({
  type:
    Joi.string()
      .required(),
  content:
    Joi.object()
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
