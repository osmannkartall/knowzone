import { BE_ROUTES } from '../../constants/routes';

export default async function getSearchResults(body, next) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.SEARCH}?cursor=${next}`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
      },
    );
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}
