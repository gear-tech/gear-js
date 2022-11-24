import { useEffect, useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { useMessages, useDataLoading } from 'hooks';

import { RequestParams, ParamsValues } from '../model/types';
import { DEFAULT_REQUEST_PARAMS, DEFAULT_FILTER_VALUES } from '../model/consts';
import { MessagesList } from './messagesList';
import { SearchSettings } from './searchSettings';
import styles from './Messages.module.scss';

const Messages = () => {
  const { account } = useAccount();

  const { messages, isLoading, totalCount, fetchMessages } = useMessages();
  const { params, loadData, changeParams } = useDataLoading<RequestParams>({
    defaultParams: DEFAULT_REQUEST_PARAMS,
    fetchData: fetchMessages,
  });

  const [initialValues, setInitialValues] = useState(DEFAULT_FILTER_VALUES);

  const decodedAddress = account?.decodedAddress;

  const getOwnerParam = (value: string | undefined) => (value && value !== 'all' ? { [value]: decodedAddress } : {});

  const handleParamsChange = ({ query, owner }: ParamsValues) => {
    const isFilterSubmit = query === undefined;

    if (isFilterSubmit) {
      changeParams((prevParams) => ({ query: prevParams.query, ...getOwnerParam(owner) }));
    } else {
      changeParams((prevParams) => ({ ...prevParams, query }));
    }
  };

  useEffect(
    () => {
      const { source, destination } = params;
      if (!source && !destination) return;

      changeParams((prevParams) => ({ ...prevParams, [source ? 'source' : 'destination']: decodedAddress }));

      // TODO: monkey patch to rerender on user logout
      // this is bad, Filters component should be refactored
      if (!decodedAddress) setInitialValues((prevValues) => ({ owner: 'all', isRerender: !prevValues.isRerender }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [decodedAddress],
  );

  const isLoggedIn = Boolean(account);
  const heading = `Messages: ${totalCount}`;

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.messagesSection}>
        <h2 className={styles.heading}>{heading}</h2>
        <MessagesList messages={messages} totalCount={totalCount} isLoading={isLoading} loadMorePrograms={loadData} />
      </section>
      <SearchSettings isLoggedIn={isLoggedIn} initialValues={initialValues} onSubmit={handleParamsChange} />
    </div>
  );
};

export { Messages };
