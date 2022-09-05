import { useEffect, useCallback, useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { usePrograms, useDataLoading } from 'hooks';
import { Sort, SortBy } from 'features/sortBy';

import styles from './Programs.module.scss';
import { Owner, RequestParams } from '../model/types';
import { DEFAULT_REQUEST_PARAMS, DEFAULT_FILTER_VALUES } from '../model/consts';
import { ProgramsList } from './programsList';
import { SearchSettings } from './searchSettings';

const Programs = () => {
  const { account } = useAccount();

  const { programs, isLoading, totalCount, fetchPrograms } = usePrograms();
  const { params, loadData, changeParams } = useDataLoading<RequestParams>({
    defaultParams: DEFAULT_REQUEST_PARAMS,
    fetchData: fetchPrograms,
  });

  const [initialValues, setInitialValues] = useState(DEFAULT_FILTER_VALUES);

  const decodedAddress = account?.decodedAddress;

  const handleParamsChange = useCallback(
    ({ query, owner }: RequestParams) =>
      changeParams({
        query,
        owner: owner === Owner.All ? undefined : decodedAddress,
      }),
    [changeParams, decodedAddress],
  );

  const handleSortChange = (sortBy: Sort) => changeParams({ sortBy });

  useEffect(
    () => {
      const { owner, createAt = '', status = [] } = params;

      if (!owner) {
        return;
      }

      changeParams({ owner: decodedAddress || undefined });

      if (!decodedAddress) {
        setInitialValues({
          owner: Owner.All,
          status,
          createAt,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [decodedAddress],
  );

  const isLoggedIn = Boolean(account);

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.programsSection}>
        <SortBy title="programs" count={totalCount} onChange={handleSortChange} />
        <ProgramsList
          programs={programs}
          totalCount={totalCount}
          isLoading={isLoading}
          isLoggedIn={isLoggedIn}
          loadMorePrograms={loadData}
        />
      </section>
      <SearchSettings isLoggedIn={isLoggedIn} initialValues={initialValues} onSubmit={handleParamsChange} />
    </div>
  );
};

export { Programs };
