import { Link } from 'react-router-dom';
import { Block } from '@polkadot/types/interfaces';
import clsx from 'clsx';

import { ReactComponent as CodeSVG } from 'shared/assets/images/actions/code.svg';
import { ReactComponent as SummaryPlaceholderSVG } from 'shared/assets/images/placeholders/blockSummaryPlaceholder.svg';
import { ReactComponent as NumberPlaceholderSVG } from 'shared/assets/images/placeholders/blockNumberPlaceholder.svg';

import { Placeholder } from 'entities/placeholder';
import commonStyles from '../Explorer.module.scss';
import styles from './Summary.module.scss';

type Props = {
  block: Block | undefined;
  isError: boolean;
};

const Summary = ({ block, isError }: Props) => {
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
          {number ? number.toString() : <Placeholder block={<NumberPlaceholderSVG />} isEmpty={isError} />}
        </span>
        <span>Hash</span>
        <span>Parent</span>
        <span>Extrinsics</span>
        <span>State</span>
      </header>
      <div className={commonStyles.body}>
        {block ? (
          <div className={rowClassName}>
            <span />
            <span>{hash?.toString()}</span>
            <Link to={parentPath} className={styles.link}>
              {parentHash?.toString()}
            </Link>
            <span>{extrinsicsRoot?.toString()}</span>
            <span>{stateRoot?.toString()}</span>
          </div>
        ) : (
          <Placeholder block={<SummaryPlaceholderSVG />} isEmpty={isError} />
        )}
      </div>
    </div>
  );
};

export { Summary };
