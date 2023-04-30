import { BE_ROUTES } from '../../constants/routes';

const getPopularTopics = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.EXPLORE_TOPICS}`,
      {
        credentials: 'include',
      },
    );
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getPopularTopics;
