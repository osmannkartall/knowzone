import { BE_ROUTES } from '../../constants/routes';

const getFormTypes = async (next) => {
  try {
    const body = {
      projection: { type: 1 },
    };

    const response = await fetch(
      `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}/filter?cursor=${next}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getFormTypes;
