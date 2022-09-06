import SimpleBar from 'simplebar-react';

import { useScrollLoader } from 'hooks';
import { IProgram, HorizontalProgramCard } from 'entities/program';

import clsx from 'clsx';
import styles from './ProgramsList.module.scss';
import { ProgramsPlaceholder } from '../programsPlaceholder';

type Props = {
  programs: IProgram[];
  isLoading: boolean;
  totalCount: number;
  isLoggedIn: boolean;
  loadMorePrograms: () => void;
};

const ProgramsList = (props: Props) => {
  const { programs, isLoading, totalCount, isLoggedIn, loadMorePrograms } = props;

  const hasMore = !isLoading && programs.length < totalCount;
  const isEmpty = !(isLoading || totalCount);
  const isLoaderShowing = isEmpty || (!totalCount && isLoading);

  const scrollableNodeRef = useScrollLoader<HTMLDivElement>(loadMorePrograms, hasMore);

  return (
    <div className={styles.programsList}>
      <SimpleBar
        className={clsx(styles.simpleBar, isLoaderShowing && styles.noOverflow)}
        scrollableNodeProps={{ ref: scrollableNodeRef }}>
        {isLoaderShowing ? (
          <ProgramsPlaceholder isEmpty={isEmpty} />
        ) : (
          programs.map((program) => (
            <HorizontalProgramCard key={program.id} program={program} withSendMessage={isLoggedIn} />
          ))
        )}
      </SimpleBar>
    </div>
  );
};

export { ProgramsList };
