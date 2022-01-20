import React from 'react';
import clsx from 'clsx';
import styles from './Header.module.scss';
import commonStyles from '../../EventItem.module.scss';

type Props = {
  caption: string;
  description: string;
  isOpen: boolean;
  onClick: () => void;
};

const Header = ({ caption, description, isOpen, onClick }: Props) => {
  const arrowClassName = clsx(styles.arrow, isOpen ? styles.up : styles.down);

  return (
    <header className={styles.header} onClick={onClick}>
      <div className={styles.main}>
        <span className={styles.caption}>{caption}</span>
        <span className={arrowClassName} />
        <span className={styles.number}>0x01</span>
      </div>
      <div className={commonStyles.text}>{description}</div>
    </header>
  );
};

export { Header };
