import { IProgram, HorizontalProgramCard } from 'entities/program';

import styles from './ProgramsData.module.scss';
import { SortBy } from '../sortBy';
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
      <SortBy count={count} />
      <div className={styles.programs}>
        {isEmpty || isLoading ? (
          <ProgramsPlaceholder isEmpty={isEmpty} isLoading={isLoading} />
        ) : (
          programs.map((program) => (
            <HorizontalProgramCard key={program.id} program={program} withSendMessage={isLoggedIn} />
          ))
        )}
      </div>
    </section>
  );
};

export { ProgramsData };
