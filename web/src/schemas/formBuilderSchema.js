import Joi from 'joi';
import FORM_COMPONENT_TYPES from '../constants/form-components-types';

const formBuilderSchema = Joi.object({
  type:
    Joi.string()
      .required(),
  fields:
    Joi.object()
      .unknown()
      .custom((fields, helper) => {
        const fieldsKeys = [];

        Object.values(fields).forEach((f) => {
          if (f.type === FORM_COMPONENT_TYPES.IMAGE) {
            fieldsKeys.push('images');
          } else if (f.name && f.type) {
            fieldsKeys.push(f.name);
          }
        });

        if (!fieldsKeys.length) {
          return helper.message('At least one name and type required.');
        }

        if (fieldsKeys.length !== new Set(fieldsKeys).size) {
          return helper.message('Each name of form field must be unique');
        }

        return fields;
      })
      .required(),
}).required();

export default formBuilderSchema;
