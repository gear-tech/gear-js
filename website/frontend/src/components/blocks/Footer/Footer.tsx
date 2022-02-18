import React from 'react';
import styles from './Footer.module.scss';

const Footer = () => {
  const year = new Date().getFullYear();

  return <footer className={styles.footer}>{year}. All rights reserved.</footer>;
};

export { Footer };
