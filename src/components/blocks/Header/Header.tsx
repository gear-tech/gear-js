import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';

import { routes } from 'routes';

import { LogoIcon, LogoutIcon } from 'Icons';

import './Header.scss';

const Header = () => {
  const location = useLocation();
  const showUser = location.pathname === routes.main || location.pathname === routes.uploadedPrograms;

  const { user } = useSelector((state: RootState) => state.user)

  const [isMobileMenuOpened, setIsMobileMenuOpened] =  useState(false);

  let userInfo = "";
  if (user) {
    if (user.email) {
      userInfo = user.email;
    } else if (user.username) {
      userInfo = user.username;
    }
  }

  return (
    <header className="header">
      <div className="header__logo">
        <LogoIcon color={isMobileMenuOpened ? "#282828" : "#fff"}/>
      </div>
      {(showUser && 
        <div className={`header__user-block user-block ${isMobileMenuOpened ? "show" : ""}`}>
          <div className="user-block--wrapper">
            <img src={user?.photoUrl} alt="avatar"/>
            <span className="user-block__name">{userInfo}</span>
          </div>
          <Link to={routes.logout} className="user-block__logout">
            <LogoutIcon color={isMobileMenuOpened ? "#282828" : "#fff"}/>
            <span>Sign out</span>
          </Link>
        </div>
      ) 
      ||
      (
        <nav className={`header__nav ${isMobileMenuOpened ? "show" : ""}`}>
          <button className="header__nav-button" type="button">What is GEAR?</button>
          <button className="header__nav-button" type="button">How it works</button>
          <button className="header__nav-button" type="button">Use cases</button>
          <button className="header__nav-button" type="button">Competitive analyze</button>
          <button className="header__nav-button" type="button">Team</button>
          <button className="header__nav-button" type="button">Tokenomics</button>
          <button className="header__nav-button" type="button">Timeline</button>
          <Link to={routes.main}>
            <button className="header__nav-button" type="button">Upload</button>
          </Link>
        </nav>
      )
      }
      <button 
        className={`header__burger ${isMobileMenuOpened ? "active" : ""}`}
        type="button"
        aria-label="burger"
        onClick={() => setIsMobileMenuOpened(!isMobileMenuOpened)}
      >
        <span/>
        <span/>
        <span/>
      </button>
    </header>
  );
};

export default Header;
