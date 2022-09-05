import { useEffect, useState } from 'react';
import { Account } from '@gear-js/react-hooks';

import { usePrograms } from 'hooks';
import { ProgramCard } from 'entities/program';
import { ReactComponent as ArrowSVG } from 'shared/assets/images/actions/arrowRight.svg';

import styles from './RecentProgramsSection.module.scss';
import { Filter, PROGRAMS_LIMIT } from '../../model/consts';
import { ProgramsFilter } from '../programsFilter';
import { ProgramsPlaceholder } from '../programsPlaceholder';

type Props = {
  account?: Account;
};

const RecentProgramsSection = ({ account }: Props) => {
  const [activeFilter, setActiveFilter] = useState(Filter.AllPrograms);

  const { programs, isLoading, fetchPrograms } = usePrograms();

  const decodedAddress = account?.decodedAddress;

  const getRecentPrograms = () => {
    const isAllActive = activeFilter === Filter.AllPrograms;
    const owner = isAllActive ? undefined : decodedAddress;

    fetchPrograms({ limit: PROGRAMS_LIMIT, owner }, true);
  };

  useEffect(() => {
    getRecentPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  useEffect(() => {
    if (activeFilter !== Filter.MyPrograms) {
      return;
    }

    if (decodedAddress) {
      getRecentPrograms();
    } else {
      setActiveFilter(Filter.AllPrograms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedAddress]);

  const isEmpty = !(isLoading || programs.length);

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.title}>Programs</h1>
        <ArrowSVG />
        {account && <ProgramsFilter value={activeFilter} onClick={setActiveFilter} />}
      </header>
      <div className={styles.programsWrapper}>
        {isEmpty || isLoading ? (
          <ProgramsPlaceholder isEmpty={isEmpty} />
        ) : (
          programs.map((program) => (
            <ProgramCard key={program.id} program={program} withSendMessage={Boolean(account)} />
          ))
        )}
      </div>
    </section>
  );
};

export { RecentProgramsSection };
