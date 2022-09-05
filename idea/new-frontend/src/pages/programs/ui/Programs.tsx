import { useEffect, useCallback } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { usePrograms, useDataLoading } from 'hooks';
import { Sort, SortBy } from 'features/sortBy';

import styles from './Programs.module.scss';
import { RequestParams } from '../model/types';
import { DEFAULT_REQUEST_PARAMS } from '../model/consts';
import { ProgramsList } from './programsList';
import { SearchSettings } from './searchSettings';

const Programs = () => {
  const { account } = useAccount();
  const { programs, isLoading, totalCount, fetchPrograms } = usePrograms();

  const { params, loadData, changeParams } = useDataLoading<RequestParams>({
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

  const handleSortChange = (sortBy: Sort) => changeParams({ sortBy });

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

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.programsSection}>
        <SortBy title="programs" count={totalCount} onChange={handleSortChange} />
        <ProgramsList
          programs={programs}
          totalCount={totalCount}
          isLoading={isLoading}
          isLoggedIn={Boolean(account)}
          loadMorePrograms={loadData}
        />
      </section>
      <SearchSettings requestParams={params} decodedAddress={decodedAddress} onParamsChange={handleParamsChange} />
    </div>
  );
};

export { Programs };
