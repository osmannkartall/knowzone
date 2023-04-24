import { BE_ROUTES } from '../../constants/routes';

const getPostById = async (id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.POSTS}/${id}`,
      {
        credentials: 'include',
      },
    );
    return await response.json();
  } catch (error) {
    console.log(error.message);
    return {};
  }
};

export default getPostById;
