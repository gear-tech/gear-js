import { useEffect, useCallback, useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { OwnerFilter } from 'api/consts';
import { useMessages, useDataLoading } from 'hooks';
import { Sort, SortBy } from 'features/sortBy';

import styles from './Messages.module.scss';
import { RequestParams } from '../model/types';
import { DEFAULT_REQUEST_PARAMS, DEFAULT_FILTER_VALUES } from '../model/consts';
import { MessagesList } from './messagesList';
import { SearchSettings } from './searchSettings';

const Messages = () => {
  const { account } = useAccount();

  const { messages, isLoading, totalCount, fetchMessages } = useMessages();
  const { params, loadData, changeParams } = useDataLoading<RequestParams>({
    defaultParams: DEFAULT_REQUEST_PARAMS,
    fetchData: fetchMessages,
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
      const { destination, createAt = '', location = [] } = params;

      if (!destination) {
        return;
      }

      changeParams({ destination: decodedAddress || undefined });

      if (!decodedAddress) {
        setInitialValues({
          createAt,
          location,
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
      <section className={styles.messagesSection}>
        <SortBy title="Messages" count={totalCount} onChange={handleSortChange} />
        <MessagesList messages={messages} totalCount={totalCount} isLoading={isLoading} loadMorePrograms={loadData} />
      </section>
      <SearchSettings isLoggedIn={isLoggedIn} initialValues={initialValues} onSubmit={handleParamsChange} />
    </div>
  );
};

export { Messages };
