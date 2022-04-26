import React, { useEffect, useState, VFC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessagesList } from 'components/blocks/MessagesList/MessagesList';
import { Pagination } from 'components/Pagination/Pagination';
import { INITIAL_LIMIT_BY_PAGE, LOCAL_STORAGE } from 'consts';
import { SearchForm } from '../../blocks/SearchForm/SearchForm';
import { MessageModel } from 'types/message';
import { getMessages } from 'services';
import { URL_PARAMS } from 'consts';
import './Messages.scss';

export const Messages: VFC = () => {
  const [searchParams] = useSearchParams();
  const pageFromUrl = searchParams.has(URL_PARAMS.PAGE) ? Number(searchParams.get(URL_PARAMS.PAGE)) : 1;
  const queryFromUrl = searchParams.has(URL_PARAMS.QUERY) ? String(searchParams.get(URL_PARAMS.QUERY)) : '';

  const [query, setQuery] = useState(queryFromUrl);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesCount, setMessagesCount] = useState(0);

  useEffect(() => {
    const messageParams = {
      destination: localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW),
      limit: INITIAL_LIMIT_BY_PAGE,
      offset: (currentPage - 1) * INITIAL_LIMIT_BY_PAGE,
      term: query,
    };

    getMessages(messageParams).then(({ result }) => {
      setMessages(result.messages);
      setMessagesCount(result.count);
    });
  }, [currentPage, query]);

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl, setCurrentPage]);

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl, setQuery]);

  return (
    <div className="messages">
      <div className="pagination__wrapper">
        <span className="pagination__wrapper-caption">Total results: {messagesCount || 0}</span>
        <Pagination page={currentPage} pagesAmount={messagesCount || 1} />
      </div>
      <SearchForm placeholder="Find message by ID" />
      <MessagesList messages={messages} />
      <div className="pagination_bottom">
        <Pagination page={currentPage} pagesAmount={messagesCount || 1} />
      </div>
    </div>
  );
};
