import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Block } from '@polkadot/types/interfaces';
import styles from './Summary.module.scss';

type Props = {
  block: Block;
};

const Summary = ({ block }: Props) => {
  const { header, hash } = block;
  const { number, parentHash, extrinsicsRoot, stateRoot } = header;

  const numberClassName = clsx(styles.header, styles.number);
  const linkClassName = clsx(styles.cell, styles.link);
  const parentPath = `/explorer/${parentHash}`;

  return (
    <div className={styles.summary}>
      <div className={numberClassName}>{number.toHuman()}</div>
      <div className={styles.header}>Hash</div>
      <div className={styles.header}>Parent</div>
      <div className={styles.header}>Extrinsics</div>
      <div className={styles.header}>State</div>
      <div className={styles.cell}></div>
      <div className={styles.cell}>{hash.toHuman()}</div>
      <Link to={parentPath} className={linkClassName}>
        {parentHash.toHuman()}
      </Link>
      <div className={styles.cell}>{extrinsicsRoot.toHuman()}</div>
      <div className={styles.cell}>{stateRoot.toHuman()}</div>
    </div>
  );
};

export { Summary };
