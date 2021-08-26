import { React, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();

  useEffect(() => {
    const route = 'search/filter';
    const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${route}`;

    fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(location.state),
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, [location]);

  return (
    <div>
      <h2>Search Results</h2>
    </div>
  );
};

export default SearchResults;
