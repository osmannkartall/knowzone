import * as yup from 'yup';
import POST_TYPES from '../constants/post-types';

const postFormSchema = yup.object().shape({
  type: yup
    .string()
    .required(),

  description: yup
    .string()
    .required()
    .min(1)
    .max(1000),

  error: yup
    .string()
    .min(1)
    .max(4000)
    .when('type', {
      is: POST_TYPES.get('bugfix').value,
      then: yup.string().required(),
    }),

  solution: yup
    .string()
    .min(1)
    .max(4000)
    .when('type', {
      is: POST_TYPES.get('bugfix').value,
      then: yup.string().required(),
    }),

  topics: yup
    .array()
    .of(
      yup
        .string()
        .matches(
          /^@?([a-z0-9-]){1,30}$/,
          'Invalid topic(s). A topic should be at most 30 alphanumeric characters'
            + ' and it may also contain hyphen.',
        ),
    )
    .required()
    .min(1)
    .max(5),

  links: yup
    .array()
    .required()
    .min(0)
    .max(5),
}).required();

export default postFormSchema;
