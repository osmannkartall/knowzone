import { BE_ROUTES } from '../constants/routes';

const createForm = async (newForm) => {
  const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}`;
  const response = await fetch(url, { method: 'POST',
    body: JSON.stringify(newForm),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return await response.json();
};

export default createForm;
