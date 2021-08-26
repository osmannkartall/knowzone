import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const queryString = location.search;
  const queryParamsParser = new URLSearchParams(queryString);
  const queryParams = {};
  queryParamsParser.forEach((v, k) => {
    queryParams[k] = v;
  });

  console.log(queryParams);

  useEffect(() => {
    const route = 'search/filter';
    const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${route}`;

    fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(queryParams),
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>Search Results</h2>
    </div>
  );
};

export default SearchResults;
