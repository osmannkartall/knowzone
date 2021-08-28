import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => (
  <div id="notfound">
    <div className="notfound">
      <div className="notfound-404">
        <h1>:(</h1>
      </div>
      <h2>404 - Page not found</h2>
      <p>
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <button type="button">home page</button>
    </div>
  </div>
);

export default NotFound;
