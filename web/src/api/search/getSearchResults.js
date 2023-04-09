import { BE_ROUTES } from '../../constants/routes';

export default async function getSearchResults(body, cursor) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.SEARCH}?cursor=${cursor}`,
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
