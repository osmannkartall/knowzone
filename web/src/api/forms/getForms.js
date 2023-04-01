import { BE_ROUTES } from '../../constants/routes';

const getForms = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}`,
      {
        method: 'GET',
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

export default getForms;
