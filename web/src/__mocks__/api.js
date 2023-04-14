import { rest } from 'msw';
import { BE_ROUTES } from '../constants/routes';
import { forms, formTypes } from './data';

const getForms = rest.get(
  `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}`,
  (req, res, ctx) => res(ctx.json(forms)),
);

const createForm = rest.post(
  `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}`,
  (req, res, ctx) => res(ctx.json({ status: 'success', message: 'Created Successfully' })),
);

const getFormTypes = rest.post(
  `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}/filter`,
  async (req, res, ctx) => res(ctx.json(formTypes)),
);

const getFormByType = rest.get(
  `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}`,
  (req, res, ctx) => res(ctx.json(forms[req.url.searchParams.get('type')])),
);

const api = [
  getForms,
  createForm,
  getFormTypes,
  getFormByType,
];

export default api;
