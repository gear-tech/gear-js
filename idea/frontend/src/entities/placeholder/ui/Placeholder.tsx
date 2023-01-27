import { ReactNode } from 'react';
import clsx from 'clsx';

import { EmptyContent } from 'shared/ui/emptyContent';

import styles from './Placeholder.module.scss';

type Props = {
  block: ReactNode;
  isEmpty: boolean;
  title?: string;
  children?: ReactNode;
  blocksCount?: number;
  description?: string;
};

const Placeholder = ({ title, block, isEmpty, children, blocksCount = 1, description }: Props) => {
  const getOpacityClassName = (blockIndex: number) => {
    const lastBlockIndex = blocksCount - 1;

    switch (blockIndex) {
      case lastBlockIndex:
        return 'transparent';
      case lastBlockIndex - 1:
        return 'semiTransparent';
      case lastBlockIndex - 2:
        return 'barelyTransparent';
      default:
        return '';
    }
  };

  const renderBlocks = () => {
    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < blocksCount; i++) {
      result.push(
        <div key={i} className={clsx(styles.block, !isEmpty && styles.loading, styles[getOpacityClassName(i)])}>
          {block}
        </div>,
      );
    }

    return result;
  };

  return (
    <>
      {renderBlocks()}
      <EmptyContent title={title} description={description} isVisible={isEmpty}>
        {children}
      </EmptyContent>
    </>
  );
};

export { Placeholder };
