import clsx from 'clsx';

import { EmptyContent } from 'shared/ui/emptyContent';
import { ExamplesLink } from 'shared/ui/examplesLink';
import { ReactComponent as ProgramCardSVG } from 'shared/assets/images/placeholders/programCard.svg';

import styles from './ProgramsPlaceholder.module.scss';
import { PROGRAMS_LIMIT } from '../../model/consts';

type Props = {
  isEmpty: boolean;
};

const ProgramsPlaceholder = ({ isEmpty }: Props) => {
  const loaderClasses = clsx(styles.block, !isEmpty && styles.loading);

  const renderBlocks = () => {
    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < PROGRAMS_LIMIT; i++) {
      result.push(
        <div key={i} className={loaderClasses}>
          <ProgramCardSVG />
        </div>,
      );
    }

    return result;
  };

  return (
    <>
      {renderBlocks()}
      {isEmpty && (
        <EmptyContent
          title="There is no program yet"
          description="You can start experimenting right now or try to build from examples. Let's Rock!">
          <ExamplesLink />
        </EmptyContent>
      )}
    </>
  );
};

export { ProgramsPlaceholder };
