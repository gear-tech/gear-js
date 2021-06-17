import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './Header.scss';
import logo from '../../../images/logo.svg';

const Header = () => {
  const location = useLocation();
  const showUser = location.pathname === '/upload-program' || location.pathname === '/uploaded-programs';
  return (
    <header className="header">
      <img alt="logo gear" className="header__logo" src={logo} />
      {(showUser && 
        <div className="header__user-block user-block">
          <span className="user-block__name">k.konstantinopolski@gmail.com</span>
          <Link to="/sign-in" className="user-block__logout" />
        </div>
      ) ||
       <nav className="header__nav">
          <button className="header__nav-button" type="button">What is GEAR?</button>
          <button className="header__nav-button" type="button">How it works</button>
          <button className="header__nav-button" type="button">Use cases</button>
          <button className="header__nav-button" type="button">Competitive analyze</button>
          <button className="header__nav-button" type="button">Team</button>
          <button className="header__nav-button" type="button">Tokenomics</button>
          <button className="header__nav-button" type="button">Timeline</button>
          <Link to="/upload-program">
            <button className="header__nav-button" type="button">Upload</button>
          </Link>
        </nav>
      }
    </header>
  );
};

export default Header;
