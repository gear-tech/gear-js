import RenderIfVisible from 'react-render-if-visible';

import { SortBy } from 'features/sortBy';
import { IProgram, HorizontalProgramCard } from 'entities/program';

import styles from './ProgramsData.module.scss';
import { ProgramsPlaceholder } from '../programsPlaceholder';

type Props = {
  count: number;
  programs: IProgram[];
  isLoading: boolean;
  isLoggedIn: boolean;
};

const ProgramsData = ({ count, programs, isLoading, isLoggedIn }: Props) => {
  const isEmpty = !(isLoading || programs.length);

  return (
    <section className={styles.programsSection}>
      <SortBy title="programs" count={count} />
      <div className={styles.programs}>
        {isEmpty || isLoading ? (
          <ProgramsPlaceholder isEmpty={isEmpty} isLoading={isLoading} />
        ) : (
          programs.map((program) => (
            <RenderIfVisible key={program.id} initialVisible defaultHeight={110} rootElementClass={styles.programItem}>
              <HorizontalProgramCard program={program} withSendMessage={isLoggedIn} />
            </RenderIfVisible>
          ))
        )}
      </div>
    </section>
  );
};

export { ProgramsData };
