import clsx from 'clsx';

import { EmptyContent } from 'shared/ui/emptyContent';
import { ExamplesLink } from 'shared/ui/examplesLink';
import { ReactComponent as HorizontalProgramCardSVG } from 'shared/assets/images/placeholders/horizontalProgramCard.svg';

import styles from './ProgramsPlaceholder.module.scss';

type Props = {
  isEmpty: boolean;
};

const ProgramsPlaceholder = ({ isEmpty }: Props) => {
  const loaderClasses = clsx(styles.block, !isEmpty && styles.loading);

  const renderBlocks = () => {
    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 6; i++) {
      result.push(
        <div key={i} className={loaderClasses}>
          <HorizontalProgramCardSVG />
        </div>,
      );
    }

    return result;
  };

  return (
    <>
      {renderBlocks()}
      <EmptyContent
        title="There is no program yet"
        isVisible={isEmpty}
        description="You can start experimenting right now or try to build from examples. Let's Rock!">
        <ExamplesLink />
      </EmptyContent>
    </>
  );
};

export { ProgramsPlaceholder };
