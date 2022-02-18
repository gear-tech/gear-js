import React from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { routes } from 'routes';
import styles from './Footer.module.scss';

const Footer = () => {
  const { pathname } = useLocation();
  const isLight = pathname !== routes.main || pathname !== routes.uploadedPrograms;
  const className = clsx(styles.footer, isLight && styles.light);

  return (
    <footer className={className}>
      <span className={styles.content}>2022. All rights reserved.</span>
    </footer>
  );
};

export { Footer };
