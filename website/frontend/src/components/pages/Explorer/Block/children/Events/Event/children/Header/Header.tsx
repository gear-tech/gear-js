import React from 'react';
import clsx from 'clsx';
import { AnyJson } from '@polkadot/types/types';
import styles from './Header.module.scss';
import commonStyles from '../../Event.module.scss';

type Props = {
  caption: string;
  description: AnyJson;
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
      </div>
      <div className={commonStyles.text}>{description}</div>
    </header>
  );
};

export { Header };
