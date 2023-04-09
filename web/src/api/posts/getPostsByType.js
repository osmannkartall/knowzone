import { BE_ROUTES } from '../../constants/routes';

const getPostsByType = async (type, next) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.POSTS}?type=${type}&cursor=${next}`,
      {
        credentials: 'include',
      },
    );
    return await response.json();
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export default getPostsByType;
