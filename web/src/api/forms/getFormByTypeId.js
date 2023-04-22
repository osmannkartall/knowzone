import { BE_ROUTES } from '../../constants/routes';

const getFormByTypeId = async (typeId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}?typeId=${typeId}`,
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

export default getFormByTypeId;
