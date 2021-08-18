import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const queryParamsParser = new URLSearchParams(location.search);
  const queryParams = {};
  queryParamsParser.forEach((v, k) => {
    queryParams[k] = v;
  });

  console.log(queryParams);

  return (
    <p>
      Search Results
    </p>
  );
};

export default SearchResults;
