import React from 'react';
import dot from 'assets/images/dot-logo.svg';
import styles from './Button.module.scss';

const Button = () => {
  return (
    <a href="https://polkadot.js.org/apps/#/explorer" target="_blank" rel="noreferrer" className={styles.button}>
      <img src={dot} alt="logo" className={styles.icon} />
      Polkadot
    </a>
  );
};

export { Button };
