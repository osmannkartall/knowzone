import { BE_ROUTES } from '../../constants/routes';

const getFormByType = async (type) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}?type=${type}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    return response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getFormByType;
