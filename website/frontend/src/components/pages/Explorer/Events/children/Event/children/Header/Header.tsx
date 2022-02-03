import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { AnyJson } from '@polkadot/types/types';
import styles from './Header.module.scss';
import commonStyles from '../../Event.module.scss';

type Props = {
  caption: string;
  description: AnyJson;
  blockNumber: string;
  isOpen: boolean;
  onClick: () => void;
  groupEventsAmount: number;
};

const Header = ({ caption, description, blockNumber, isOpen, onClick, groupEventsAmount }: Props) => {
  const arrowClassName = clsx(styles.arrow, isOpen ? styles.up : styles.down);
  const formattedBlockNumber = blockNumber.split(',').join('');
  const blockPath = `/explorer/${formattedBlockNumber}`;

  return (
    <header className={styles.header} onClick={onClick}>
      <div className={styles.main}>
        <span className={styles.caption}>{caption}</span>
        <span className={arrowClassName} />
        {groupEventsAmount > 1 && <span className={styles.counter}>{groupEventsAmount}</span>}
        <Link to={blockPath} className={styles.number}>
          {blockNumber}
        </Link>
      </div>
      <div className={commonStyles.text}>{description}</div>
    </header>
  );
};

export { Header };
