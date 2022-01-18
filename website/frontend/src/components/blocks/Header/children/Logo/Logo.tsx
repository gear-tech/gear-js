import React from 'react';
import { LogoIcon } from 'assets/Icons';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import styles from './Logo.module.scss';

const Logo = () => (
  <Link to={routes.main} className={`img-wrapper ${styles.logo}`}>
    <LogoIcon color="#fff" />
  </Link>
);

export default Logo;
