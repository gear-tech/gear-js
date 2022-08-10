import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from '@gear-js/react-hooks';

import { useChangeEffect } from 'hooks';
import { getMessages } from 'services';
import { MessageModel } from 'types/message';
import { INITIAL_LIMIT_BY_PAGE, URL_PARAMS } from 'consts';
import { layoutStyles } from 'layout/MainPageLayout';
import { Pagination } from 'components/Pagination/Pagination';
import { SearchForm } from 'components/blocks/SearchForm/SearchForm';
import { MessagesList } from 'components/blocks/MessagesList';

const Messages = () => {
  const { account } = useAccount();

  const [searchParams, setSearchParams] = useSearchParams();

  const [messages, setMessages] = useState<MessageModel[]>();
  const [messagesCount, setMessagesCount] = useState(0);

  const page = Number(searchParams.get(URL_PARAMS.PAGE) ?? 1);
  const query = searchParams.get(URL_PARAMS.QUERY) ?? '';
  const decodedAddress = account?.decodedAddress;

  useEffect(() => {
    if (decodedAddress) {
      const messageParams = {
        destination: decodedAddress,
        limit: INITIAL_LIMIT_BY_PAGE,
        offset: (page - 1) * INITIAL_LIMIT_BY_PAGE,
        query,
      };

      getMessages(messageParams).then(({ result }) => {
        setMessages(result.messages);
        setMessagesCount(result.count);
      });
    }
  }, [page, query, decodedAddress]);

  useChangeEffect(() => {
    searchParams.set(URL_PARAMS.PAGE, String(1));
    searchParams.set(URL_PARAMS.QUERY, '');
    setSearchParams(searchParams);
    setMessages([]);
    setMessagesCount(0);
  }, [decodedAddress]);

  const isLoading = !messages && Boolean(account);

  return (
    <div>
      <div className={layoutStyles.topPagination}>
        <span className={layoutStyles.caption}>Total results: {messagesCount}</span>
        <Pagination page={page} pagesAmount={messagesCount || 1} />
      </div>
      <SearchForm placeholder="Find message by ID" />
      <MessagesList messages={messages} isLoading={isLoading} className={layoutStyles.tableBody} />
      {messagesCount > 0 && (
        <div className={layoutStyles.bottomPagination}>
          <Pagination page={page} pagesAmount={messagesCount} />
        </div>
      )}
    </div>
  );
};

export { Messages };
