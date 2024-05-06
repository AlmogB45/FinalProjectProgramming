import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          img
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <a href="#" className="navbar-link">Home</a>
          </li>
          <li className="navbar-item">
            <a href="#" className="navbar-link">Profile</a>
          </li>
        </ul>
        <div className="navbar-search">
          <input type="text" placeholder="Search" />
          <button className="search-button">Search</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

