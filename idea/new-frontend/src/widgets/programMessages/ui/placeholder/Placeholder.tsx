import clsx from 'clsx';

import { EmptyContent } from 'shared/ui/emptyContent';
import { ReactComponent as HorizontalMessageCardSVG } from 'shared/assets/images/placeholders/horizontalMessageCard.svg';

import styles from './Placeholder.module.scss';

type Props = {
  isEmpty: boolean;
};

const Placeholder = ({ isEmpty }: Props) => {
  const loaderClasses = clsx(styles.block, !isEmpty && styles.loading);

  const renderBlocks = () => {
    const result = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 8; i++) {
      result.push(
        <div key={i} className={loaderClasses}>
          <HorizontalMessageCardSVG />
        </div>,
      );
    }

    return result;
  };

  return (
    <>
      {renderBlocks()}
      <EmptyContent title="There is no messages yet" isVisible={isEmpty} />
    </>
  );
};

export { Placeholder };
