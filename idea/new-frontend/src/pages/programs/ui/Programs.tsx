import { useEffect } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { usePrograms } from 'hooks';

import styles from './Programs.module.scss';
import { ProgramsData } from './programsData';
import { ProgramsFilters } from './programsFilters';

const Programs = () => {
  const { account } = useAccount();
  const { programsData, isLoading, fetchPrograms } = usePrograms();

  useEffect(() => {
    fetchPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoggedIn = Boolean(account);
  const decodedAddress = account?.decodedAddress;

  const { count, programs } = programsData;

  return (
    <div className={styles.pageWrapper}>
      <ProgramsData count={count} programs={programs} isLoading={isLoading} isLoggedIn={isLoggedIn} />
      <ProgramsFilters decodedAddress={decodedAddress} />
    </div>
  );
};

export { Programs };
