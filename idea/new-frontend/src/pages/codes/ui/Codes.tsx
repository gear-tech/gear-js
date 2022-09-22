import { useEffect, useCallback, useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { OwnerFilter } from 'api/consts';
import { useCodes, useDataLoading } from 'hooks';
import { Sort, SortBy } from 'features/sortBy';

import styles from './Codes.module.scss';
import { RequestParams } from '../model/types';
import { DEFAULT_REQUEST_PARAMS, DEFAULT_FILTER_VALUES } from '../model/consts';
import { CodesList } from './codesList';
import { SearchSettings } from './searchSettings';

const Codes = () => {
  const { account } = useAccount();

  const { codes, isLoading, totalCount, fetchCodes } = useCodes();
  const { params, loadData, changeParams } = useDataLoading<RequestParams>({
    defaultParams: DEFAULT_REQUEST_PARAMS,
    fetchData: fetchCodes,
  });

  const [initialValues, setInitialValues] = useState(DEFAULT_FILTER_VALUES);

  const decodedAddress = account?.decodedAddress;

  const handleParamsChange = useCallback(
    ({ query, destination }: RequestParams) =>
      changeParams({
        query,
        destination: destination === OwnerFilter.All ? undefined : decodedAddress,
      }),
    [changeParams, decodedAddress],
  );

  const handleSortChange = (sortBy: Sort) => changeParams({ sortBy });

  useEffect(
    () => {
      const { destination, createAt = '' } = params;

      if (!destination) {
        return;
      }

      changeParams({ destination: decodedAddress || undefined });

      if (!decodedAddress) {
        setInitialValues({
          createAt,
          destination: OwnerFilter.All,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [decodedAddress],
  );

  const isLoggedIn = Boolean(account);

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.codesSection}>
        <SortBy title="Codes" count={totalCount} onChange={handleSortChange} />
        <CodesList codes={codes} totalCount={totalCount} isLoading={isLoading} loadMorePrograms={loadData} />
      </section>
      <SearchSettings isLoggedIn={isLoggedIn} initialValues={initialValues} onSubmit={handleParamsChange} />
    </div>
  );
};

export { Codes };
