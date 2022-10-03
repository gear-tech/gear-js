import { Link } from 'react-router-dom';
import { Block } from '@polkadot/types/interfaces';
import clsx from 'clsx';

import { ReactComponent as CodeSVG } from 'shared/assets/images/actions/code.svg';

import { BlockTablePlaceholder } from '../blockTablePlaceholder';
import commonStyles from '../Explorer.module.scss';
import styles from './Summary.module.scss';

type Props = {
  block: Block | undefined;
  isLoading: boolean;
};

const Summary = ({ block, isLoading }: Props) => {
  const { header, hash } = block || {};
  const { number, parentHash, extrinsicsRoot, stateRoot } = header || {};

  const headerClassName = clsx(commonStyles.header, styles.layout);
  const rowClassName = clsx(commonStyles.row, styles.layout);
  const parentPath = `/explorer/${parentHash}`;

  return (
    <div>
      <header className={headerClassName}>
        <span className={styles.number}>
          <CodeSVG />
          {number?.toHuman()}
        </span>
        <span>Hash</span>
        <span>Parent</span>
        <span>Extrinsics</span>
        <span>State</span>
      </header>
      <div className={commonStyles.body}>
        {isLoading ? (
          <BlockTablePlaceholder />
        ) : (
          <div className={rowClassName}>
            <span />
            <span>{hash?.toHuman()}</span>
            <Link to={parentPath} className={styles.link}>
              {parentHash?.toHuman()}
            </Link>
            <span>{extrinsicsRoot?.toHuman()}</span>
            <span>{stateRoot?.toHuman()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export { Summary };
