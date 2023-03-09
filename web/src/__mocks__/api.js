import { rest } from 'msw';
import { BE_ROUTES } from '../constants/routes';

const api = [
  rest.post(
    `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}`,
    async (req, res, ctx) => res(ctx.json({ status: 'success', message: 'Created Successfully' })),
  ),
  rest.get(
    `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}`,
    async (req, res, ctx) => res(ctx.json([])),
  ),
];

export default api;
