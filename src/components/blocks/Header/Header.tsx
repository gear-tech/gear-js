import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { routes } from 'routes';

import { LogoIcon, LogoutIcon } from 'Icons';

import './Header.scss';
import GithubAvatar from "images/github_gray.svg";

const Header = () => {
  const dispatch = useDispatch();

  const location = useLocation();
  const showUser = location.pathname === routes.main || location.pathname === routes.uploadedPrograms;

  const [isMobileMenuOpened, setIsMobileMenuOpened] =  useState(false);

  useEffect(() => {
    console.log('haha')
  }, [dispatch])

  return (
    <header className="header">
      <div className="header__logo">
        <LogoIcon color={isMobileMenuOpened ? "#282828" : "#fff"}/>
      </div>
      {(showUser && 
        <div className={`header__user-block user-block ${isMobileMenuOpened ? "show" : ""}`}>
          <div className="user-block--wrapper">
            <img src={GithubAvatar} alt="avatar"/>
            <span className="user-block__name">k.konstantinopolski@gmail.com</span>
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
