import clsx from 'clsx';

import { EmptyContent } from 'shared/ui/emptyContent';
import { ReactComponent as EmptyBlockSVG } from 'shared/assets/images/placeholders/emptyBlock.svg';

import styles from './ProgramsPlaceholder.module.scss';
import { PROGRAMS_LIMIT } from '../../model/consts';

type Props = {
  isEmpty: boolean;
  isLoading: boolean;
};

const ProgramsPlaceholder = ({ isEmpty, isLoading }: Props) => {
  const loaderClasses = clsx(styles.block, isLoading && styles.loading);

  const renderBlocks = () =>
    new Array(PROGRAMS_LIMIT).fill('').map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={index}>
        <EmptyBlockSVG className={loaderClasses} />
      </div>
    ));

  return (
    <>
      {renderBlocks()}
      {isEmpty && (
        <EmptyContent
          title="There is no program yet"
          description="You can start experimenting right now or try to build from examples. Let's Rock!"
        />
      )}
    </>
  );
};

export { ProgramsPlaceholder };
