import { BE_ROUTES } from '../../constants/routes';

const getFormByType = async (type) => {
  try {
    const body = {
      fields: { type },
      single: true,
    };

    const response = await fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}/filter`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getFormByType;
