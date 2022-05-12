import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GearKeyring } from '@gear-js/api';

import './Messages.scss';
import { SearchForm } from '../../blocks/SearchForm/SearchForm';

import { getMessages } from 'services';
import { MessageModel } from 'types/message';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { useAccount, useChangeEffect } from 'hooks';
import { Pagination } from 'components/Pagination/Pagination';
import { MessagesList } from 'components/blocks/MessagesList/MessagesList';

export const Messages = () => {
  const location = useLocation();
  const { account } = useAccount();

  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = searchParams.has('page') ? Number(searchParams.get('page')) : 1;

  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesCount, setMessagesCount] = useState(0);

  const [term, setTerm] = useState('');
  const [page, setPage] = useState(pageFromUrl);

  const handleSearch = (currentTerm: string) => {
    setTerm(currentTerm);
    setPage(1);
  };

  const handleRemoveQuery = () => {
    setTerm('');
    setPage(1);
  };

  useChangeEffect(handleRemoveQuery, [account]);

  useEffect(() => {
    if (account) {
      const messageParams = {
        destination: GearKeyring.decodeAddress(account.address),
        limit: INITIAL_LIMIT_BY_PAGE,
        offset: (page - 1) * INITIAL_LIMIT_BY_PAGE,
        term,
      };

      getMessages(messageParams).then(({ result }) => {
        setMessages(result.messages);
        setMessagesCount(result.count);
      });
    }
  }, [page, term, account]);

  return (
    <div className="messages">
      <div className="pagination__wrapper">
        <span className="pagination__wrapper-caption">Total results: {messagesCount || 0}</span>
        <Pagination page={page} count={messagesCount || 1} onPageChange={setPage} />
      </div>
      <div>
        <SearchForm
          placeholder="Find message by ID"
          handleSearch={handleSearch}
          handleRemoveQuery={handleRemoveQuery}
        />
        <br />
      </div>
      <MessagesList messages={messages} />
      <div className="pagination_bottom">
        <Pagination page={page} count={messagesCount || 1} onPageChange={setPage} />
      </div>
    </div>
  );
};
