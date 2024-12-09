import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <h1>My Products </h1>
      <nav className="header-nav">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/create-product" className="nav-link">
          Create Product
        </Link>
      </nav>
    </header>
  );
};

export default Header;
