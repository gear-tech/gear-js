import React from 'react';
import { Button } from './children/Button/Button';
import { Copyright } from './children/Copyright/Copyright';
import { Socials } from './children/Socials/Socials';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Button />
      <Copyright />
      <Socials />
    </footer>
  );
};

export { Footer };
