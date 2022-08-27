import { useEffect, useState } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { getPrograms } from 'api';
import { ProgramModel } from 'entities/program';
import { ReactComponent as ArrowSVG } from 'shared/assets/images/actions/arrowRight.svg';

import styles from './RecentPrograms.module.scss';
import { Filter, PROGRAMS_LIMIT } from '../../model/consts';
import { ProgramsFilter } from '../programsFilter';
import { ProgramsPlaceholder } from '../programsPlaceholder';

type Props = {
  isLoggedIn: boolean;
};

const RecentPrograms = ({ isLoggedIn }: Props) => {
  const alert = useAlert();

  const [programs, setPrograms] = useState<ProgramModel[]>([]);
  const [isLoading, setIsloading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(Filter.AllPrograms);

  useEffect(() => {
    getPrograms({ limit: PROGRAMS_LIMIT })
      .then((data) => setPrograms([]))
      .catch((error) => alert.error(error.message))
      .finally(() => setIsloading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      setActiveFilter(Filter.AllPrograms);
    },
    [isLoggedIn],
  );

  const isEmpty = !(isLoading || programs.length);

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.title}>Programs</h1>
        <ArrowSVG />
        {isLoggedIn && <ProgramsFilter value={activeFilter} onClick={setActiveFilter} />}
      </header>
      <div className={styles.programsWrapper}>
        {isEmpty || isLoading ? <ProgramsPlaceholder isEmpty={isEmpty} isLoading={isLoading} /> : null}
      </div>
    </section>
  );
};

export { RecentPrograms };
