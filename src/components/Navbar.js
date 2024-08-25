import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-menu">
          <Link to="/mainpage" className="navbar-link">
            Home
          </Link>

          <Link to="/profile" className="navbar-link">
            Profile
          </Link>

          <Link to="/publish-item" className="navbar-link">
            Publish Item
          </Link>

          <Link to="/favorites" className="navbar-link">
            Favorites
          </Link>
          
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

