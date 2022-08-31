import { useEffect } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { usePrograms } from 'hooks';

import styles from './Programs.module.scss';
import { ProgramsData } from './programsData';

const Programs = () => {
  const { account } = useAccount();
  const { programsData, isLoading, fetchPrograms } = usePrograms();

  useEffect(() => {
    fetchPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoggedIn = Boolean(account);
  const { count, programs } = programsData;

  return (
    <div className={styles.pageWrapper}>
      <ProgramsData count={count} programs={programs} isLoading={isLoading} isLoggedIn={isLoggedIn} />
    </div>
  );
};

export { Programs };
