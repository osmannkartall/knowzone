import { BE_ROUTES } from '../constants/routes';

const getPosts = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.POSTS}`,
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

export default getPosts;
