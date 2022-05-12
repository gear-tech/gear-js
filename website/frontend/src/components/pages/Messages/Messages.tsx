import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GearKeyring } from '@gear-js/api';

import './Messages.scss';
import { SearchForm } from '../../blocks/SearchForm/SearchForm';

import { getMessages } from 'services';
import { MessageModel } from 'types/message';
import { INITIAL_LIMIT_BY_PAGE, URL_PARAMS } from 'consts';
import { useAccount, useChangeEffect } from 'hooks';
import { Pagination } from 'components/Pagination/Pagination';
import { MessagesList } from 'components/blocks/MessagesList/MessagesList';

export const Messages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { account } = useAccount();

  const page = searchParams.has(URL_PARAMS.PAGE) ? Number(searchParams.get(URL_PARAMS.PAGE)) : 1;
  const query = searchParams.has(URL_PARAMS.QUERY) ? String(searchParams.get(URL_PARAMS.QUERY)) : '';

  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesCount, setMessagesCount] = useState(0);

  useChangeEffect(() => {
    searchParams.set(URL_PARAMS.PAGE, String(1));
    searchParams.set(URL_PARAMS.QUERY, '');
    setSearchParams(searchParams);
  }, [account]);

  useEffect(() => {
    if (account) {
      const messageParams = {
        destination: GearKeyring.decodeAddress(account.address),
        limit: INITIAL_LIMIT_BY_PAGE,
        offset: (page - 1) * INITIAL_LIMIT_BY_PAGE,
        query,
      };

      getMessages(messageParams).then(({ result }) => {
        setMessages(result.messages);
        setMessagesCount(result.count);
      });
    }
  }, [page, query, account]);

  return (
    <div className="messages">
      <div className="pagination__wrapper">
        <span className="pagination__wrapper-caption">Total results: {messagesCount || 0}</span>
        <Pagination page={page} pagesAmount={messagesCount || 1} />
      </div>
      <SearchForm placeholder="Find message by ID" />
      <MessagesList messages={messages} />
      {messagesCount > 0 && (
        <div className="pagination_bottom">
          <Pagination page={page} pagesAmount={messagesCount || 1} />
        </div>
      )}
    </div>
  );
};
