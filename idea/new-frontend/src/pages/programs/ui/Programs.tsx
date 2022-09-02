import { useCallback } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { usePrograms, useDataLoading, useWindowScrollLoader } from 'hooks';

import styles from './Programs.module.scss';
import { RequestParams } from '../model/types';
import { DEFAULT_REQUEST_PARAMS } from '../model/consts';
import { ProgramsData } from './programsData';
import { SearchSettings } from './searchSettings';

const Programs = () => {
  const { account } = useAccount();
  const { programs, isLoading, totalCount, fetchPrograms } = usePrograms();

  const { hasMore, loadData, changeParams } = useDataLoading<RequestParams>({
    totalCount,
    currentCount: programs.length,
    defaultParams: DEFAULT_REQUEST_PARAMS,
    fetchData: fetchPrograms,
  });

  const handleParamsChange = useCallback(
    ({ query, owner }: RequestParams) =>
      changeParams({
        query,
        owner: owner || undefined,
      }),
    [changeParams],
  );

  useWindowScrollLoader(loadData, hasMore);

  const isLoggedIn = Boolean(account);
  const decodedAddress = account?.decodedAddress;

  return (
    <div className={styles.pageWrapper}>
      <ProgramsData
        count={totalCount}
        programs={programs}
        isLoading={!totalCount && isLoading}
        isLoggedIn={isLoggedIn}
        onParamsChange={handleParamsChange}
      />
      <SearchSettings decodedAddress={decodedAddress} onParamsChange={handleParamsChange} />
    </div>
  );
};

export { Programs };
