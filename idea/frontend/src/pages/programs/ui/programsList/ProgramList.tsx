import SimpleBar from 'simplebar-react';

import { useScrollLoader } from 'hooks';
import { Placeholder } from 'entities/placeholder';
import { IProgram, HorizontalProgramCard } from 'entities/program';
import { ExamplesLink } from 'shared/ui/examplesLink';
import { ReactComponent as HorizontalProgramCardSVG } from 'shared/assets/images/placeholders/horizontalProgramCard.svg';

import styles from './ProgramsList.module.scss';

type Props = {
  programs: IProgram[];
  isLoading: boolean;
  totalCount: number;
  loadMorePrograms: () => void;
  main?: boolean;
};

const ProgramsList = ({ programs, isLoading, totalCount, main, loadMorePrograms }: Props) => {
  const hasMore = !isLoading && programs.length < totalCount;
  const isEmpty = !(isLoading || totalCount);
  const isLoaderShowing = isEmpty || (!totalCount && isLoading);

  const scrollableNodeRef = useScrollLoader<HTMLDivElement>(loadMorePrograms, hasMore);

  const description = main
    ? "You can start experimenting right now or try to build from examples. Let's Rock!"
    : undefined;

  return (
    <div className={styles.programsList}>
      {isLoaderShowing ? (
        <Placeholder
          block={<HorizontalProgramCardSVG className={styles.placeholderBlock} />}
          title="There are no programs yet"
          description={description}
          isEmpty={isEmpty}
          blocksCount={4}>
          {main && <ExamplesLink />}
        </Placeholder>
      ) : (
        <SimpleBar className={styles.simpleBar} scrollableNodeProps={{ ref: scrollableNodeRef }}>
          {programs.map((program) => (
            <HorizontalProgramCard key={program.id} program={program} />
          ))}
        </SimpleBar>
      )}
    </div>
  );
};

export { ProgramsList };
