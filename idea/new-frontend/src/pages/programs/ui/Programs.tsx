import { useEffect, useCallback } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { usePrograms, useDataLoading } from 'hooks';

import styles from './Programs.module.scss';
import { RequestParams } from '../model/types';
import { DEFAULT_REQUEST_PARAMS } from '../model/consts';
import { ProgramsData } from './programsData';
import { SearchSettings } from './searchSettings';

const Programs = () => {
  const { account } = useAccount();
  const { programs, isLoading, totalCount, fetchPrograms } = usePrograms();

  const { params, hasMore, loadData, changeParams } = useDataLoading<RequestParams>({
    totalCount,
    currentCount: programs.length,
    defaultParams: DEFAULT_REQUEST_PARAMS,
    fetchData: fetchPrograms,
  });

  const decodedAddress = account?.decodedAddress;

  const handleParamsChange = useCallback(
    ({ query, owner }: RequestParams) => {
      console.log(owner);
      changeParams({
        query,
        owner: owner !== 'all' ? decodedAddress : undefined,
      });
    },
    [changeParams, decodedAddress],
  );

  useEffect(
    () => {
      if (!(params.owner && decodedAddress)) {
        return;
      }

      changeParams({ owner: decodedAddress });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [decodedAddress],
  );

  // useWindowScrollLoader(loadData, hasMore);

  const isLoggedIn = Boolean(account);

  return (
    <div className={styles.pageWrapper}>
      <ProgramsData
        count={totalCount}
        programs={programs}
        isLoading={!totalCount && isLoading}
        isLoggedIn={isLoggedIn}
        onParamsChange={handleParamsChange}
      />
      <SearchSettings requestParams={params} decodedAddress={decodedAddress} onParamsChange={handleParamsChange} />
    </div>
  );
};

export { Programs };
