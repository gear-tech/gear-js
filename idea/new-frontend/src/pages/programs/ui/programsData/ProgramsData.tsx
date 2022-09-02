import SimpleBar from 'simplebar-react';

import { Sort, SortBy } from 'features/sortBy';
import { IProgram, HorizontalProgramCard } from 'entities/program';

import styles from './ProgramsData.module.scss';
import { RequestParams } from '../../model/types';
import { ProgramsPlaceholder } from '../programsPlaceholder';

type Props = {
  count: number;
  programs: IProgram[];
  isLoading: boolean;
  isLoggedIn: boolean;
  onParamsChange: (params: RequestParams) => void;
};

const ProgramsData = ({ count, programs, isLoading, isLoggedIn, onParamsChange }: Props) => {
  const handleSortChange = (sortBy: Sort) => onParamsChange({ sortBy });

  const isEmpty = !(isLoading || programs.length);

  return (
    <section className={styles.programsSection}>
      <SortBy title="programs" count={count} onChange={handleSortChange} />
      <div className={styles.programs}>
        <SimpleBar className={styles.simpleBar}>
          {isEmpty || isLoading ? (
            <ProgramsPlaceholder isEmpty={isEmpty} isLoading={isLoading} />
          ) : (
            programs.map((program) => (
              <HorizontalProgramCard key={program.id} program={program} withSendMessage={isLoggedIn} />
            ))
          )}
        </SimpleBar>
      </div>
    </section>
  );
};

export { ProgramsData };
