import { useEffect, useState } from 'react';
import { useAlert, Account } from '@gear-js/react-hooks';

import { getPrograms, getUserPrograms } from 'api';
import { ProgramCard, IProgram } from 'entities/program';
import { ReactComponent as ArrowSVG } from 'shared/assets/images/actions/arrowRight.svg';

import styles from './RecentPrograms.module.scss';
import { Filter, PROGRAMS_LIMIT } from '../../model/consts';
import { ProgramsFilter } from '../programsFilter';
import { ProgramsPlaceholder } from '../programsPlaceholder';

type Props = {
  account?: Account;
};

const RecentPrograms = ({ account }: Props) => {
  const alert = useAlert();

  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [isLoading, setIsloading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(Filter.AllPrograms);

  const decodedAddress = account?.decodedAddress;

  const getRecentPrograms = () => {
    const isAllActive = activeFilter === Filter.AllPrograms;
    const fetchPrograms = isAllActive ? getPrograms : getUserPrograms;

    setIsloading(true);
    setPrograms([]);

    fetchPrograms({ limit: PROGRAMS_LIMIT, owner: isAllActive ? undefined : decodedAddress })
      .then((data) => setPrograms(data.result.programs))
      .catch((error) => alert.error(error.message))
      .finally(() => setIsloading(false));
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
          <ProgramsPlaceholder isEmpty={isEmpty} isLoading={isLoading} />
        ) : (
          programs.map((program) => <ProgramCard key={program.id} program={program} isLoggedIn={Boolean(account)} />)
        )}
      </div>
    </section>
  );
};

export { RecentPrograms };
