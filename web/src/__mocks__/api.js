import { rest } from 'msw';
import { BE_ROUTES } from '../constants/routes';
import { forms, formTypes } from './data';

const getForms = rest.get(
  `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}`,
  async (req, res, ctx) => res(ctx.json(forms)),
);

const createForm = rest.post(
  `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}`,
  async (req, res, ctx) => res(ctx.json({ status: 'success', message: 'Created Successfully' })),
);

const filterForms = rest.post(
  `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}/filter`,
  async (req, res, ctx) => {
    const body = await req.json();
    const isGetFormByType = body.fields && body.single === true;
    const isGetFormTypes = JSON.stringify(body) === JSON.stringify({ projection: { type: 1 } });

    if (isGetFormByType) {
      return res(ctx.json(forms[body.fields.type]));
    }

    if (isGetFormTypes) {
      return res(ctx.json(formTypes));
    }

    return res(ctx.json(null));
  },
);

const api = [
  getForms,
  createForm,
  filterForms,
];

export default api;
