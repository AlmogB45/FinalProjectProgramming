import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-logo">
          <span>404</span>
        </div>
        <h1>Page Not Found</h1>
        <p>Oops! The item you're looking for seems to have slipped out of our loop.</p>
        <button onClick={() => window.location.href = '/mainpage'} className="back-home-button">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;