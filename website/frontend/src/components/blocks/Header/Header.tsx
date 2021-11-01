import React, { useState, useEffect, VFC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { RootState } from 'store/reducers';
import { routes } from 'routes';
import { LogoIcon, LogoutIcon } from 'assets/Icons';
import NotificationsIcon from 'assets/images/notifications.svg';
import CodeIllustration from 'assets/images/code.svg';
import { Modal } from '../Modal';
import { Keyring } from '../Keyring';
import { RestoreJson } from '../RestoreJson';
import { Wallet } from '../Wallet';

import './Header.scss';
import githubIcon from '../../../assets/images/github_gray.svg';

export const Header: VFC = () => {
  const location = useLocation();
  const showUser =
    [routes.main, routes.uploadedPrograms, routes.allPrograms, routes.notifications].indexOf(location.pathname) > -1;
  const isNotifications = location.pathname === routes.notifications;

  const { user } = useSelector((state: RootState) => state.user);
  const { countUnread } = useSelector((state: RootState) => state.notifications);

  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRestore, setIsRestore] = useState(false);
  const [isKey, setIsKey] = useState(false);

  let userInfo = '';
  const headerIconsColor = isMobileMenuOpened ? '#282828' : '#fff';
  // const headerUnreadNotificationsCount = countUnread && countUnread >= 100 ? '99+' : countUnread;
  if (user) {
    if (user.email) {
      userInfo = user.email;
    } else if (user.username) {
      userInfo = user.username;
    }
  }

  const handleMenuClick = () => {
    setIsMobileMenuOpened(!isMobileMenuOpened);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const toggleRestoreModal = () => {
    setIsRestore(!isRestore);
  };

  useEffect(() => {
    if (isOpen || isRestore) document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isRestore]);

  useEffect(() => {
    if (localStorage.getItem('gear_mnemonic') && localStorage.getItem('gear_mnemonic') !== 'undefined') {
      setIsKey(true);
    }
  }, [isOpen, isRestore]);

  return (
    <header className="header">
      <Link to={routes.main} className="header__logo">
        <LogoIcon color={headerIconsColor} />
      </Link>
      {(showUser && (
        <div className={clsx('header__user-block user-block', isMobileMenuOpened && 'show')}>
          {/* <Link to={routes.notifications} className={clsx('user-block__notifications', isNotifications && 'selected')}>
            <NotificationIcon color={isNotifications ? '#ffffff' : '#858585'} />
            <span>Notifications</span>
            {(headerUnreadNotificationsCount && headerUnreadNotificationsCount > 0 && (
              <div className="notifications-count">{headerUnreadNotificationsCount}</div>
            )) ||
              null}
          </Link> */}
          {(isKey && <Wallet />) || (
            <>
              <Link to={routes.main} className="user-block__restore" onClick={toggleRestoreModal}>
                <span>Restore JSON</span>
              </Link>
              <Link to={routes.main} className="user-block__account" onClick={toggleModal}>
                <span>Add account</span>
              </Link>
            </>
          )}
          <div className="user-block--wrapper">
            <img src={user?.photoUrl ?? githubIcon} alt="avatar" />
            <span className="user-block__name">{userInfo}</span>
          </div>
          <Link to={routes.logout} className="user-block__logout" aria-label="menuLink" onClick={handleMenuClick}>
            <LogoutIcon color={headerIconsColor} />
            <span>Sign out</span>
          </Link>
        </div>
      )) || (
        <nav className={clsx('header__nav', isMobileMenuOpened && 'show')}>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            What is GEAR?
          </button>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            How it works
          </button>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            Use cases
          </button>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            Competitive analyze
          </button>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            Team
          </button>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            Tokenomics
          </button>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            Timeline
          </button>
          <Link to={routes.main}>
            <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
              Upload
            </button>
          </Link>
        </nav>
      )}
      <div className="header--actions-wrapper">
        <Link to={isNotifications ? routes.main : routes.notifications} className="header__notifications">
          <img src={isNotifications ? CodeIllustration : NotificationsIcon} alt="notifications" />
          {(countUnread && !isNotifications && (
            <div className="indicator">
              <div className="notifications-count mobile" />
            </div>
          )) ||
            null}
        </Link>
        <button
          className={clsx('header__burger', isMobileMenuOpened && 'active')}
          type="button"
          aria-label="burger"
          onClick={handleMenuClick}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      {isOpen && <Modal content={<Keyring handleClose={toggleModal} />} handleClose={toggleModal} />}

      {isRestore && (
        <Modal
          title="Restore from JSON"
          content={<RestoreJson handleClose={toggleRestoreModal} />}
          handleClose={toggleRestoreModal}
        />
      )}
    </header>
  );
};
