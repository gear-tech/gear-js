import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Block } from '@polkadot/types/interfaces';

import styles from './Summary.module.scss';
import commonStyles from '../../ExplorerBlock.module.scss';

type Props = {
  block: Block;
};

const Summary = ({ block }: Props) => {
  const { header, hash } = block;
  const { number, parentHash, extrinsicsRoot, stateRoot } = header;

  const numberClassName = clsx(commonStyles.header, styles.number);
  const linkClassName = clsx(commonStyles.cell, styles.link);
  const parentPath = `/explorer/${parentHash}`;

  return (
    <div className={styles.summary}>
      <div className={numberClassName}>{number.toHuman()}</div>
      <div className={commonStyles.header}>Hash</div>
      <div className={commonStyles.header}>Parent</div>
      <div className={commonStyles.header}>Extrinsics</div>
      <div className={commonStyles.header}>State</div>
      <div className={commonStyles.cell} />
      <div className={commonStyles.cell}>{hash.toHuman()}</div>
      <Link to={parentPath} className={linkClassName}>
        {parentHash.toHuman()}
      </Link>
      <div className={commonStyles.cell}>{extrinsicsRoot.toHuman()}</div>
      <div className={commonStyles.cell}>{stateRoot.toHuman()}</div>
    </div>
  );
};

export { Summary };
