import { BE_ROUTES } from '../../constants/routes';

const getPostsByType = async ({ cursor, type }) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.POSTS}?type=${type}&cursor=${cursor}`,
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
