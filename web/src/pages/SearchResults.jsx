import { useLocation } from 'react-router-dom';
import usePagination from '../hooks/usePagination';
import { BE_ROUTES } from '../constants/routes';
import Posts from '../components/post/Posts';

function SearchResults() {
  const location = useLocation();

  const { searchOptionsBodyState } = location.state ?? {};

  const { data, getNextPage, status, errorMessage } = usePagination({
    url: `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.SEARCH}`,
    method: 'POST',
    body: searchOptionsBodyState,
  });

  const { forms, posts } = data ?? {};

  return (
    <Posts
      errorMessage={errorMessage}
      forms={forms}
      getNextPage={getNextPage}
      LeftHeader={<h2>Search Results</h2>}
      posts={posts}
      status={status}
    />
  );
}

export default SearchResults;
