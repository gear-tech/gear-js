import React, { useEffect, useState, VFC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessagesList } from 'components/blocks/MessagesList/MessagesList';
import { Pagination } from 'components/Pagination/Pagination';
import { INITIAL_LIMIT_BY_PAGE, LOCAL_STORAGE } from 'consts';
import { SearchForm } from '../../blocks/SearchForm/SearchForm';
import { MessageModel } from 'types/message';
import { getMessages } from 'services';
import './Messages.scss';

export const Messages: VFC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageFromUrl = searchParams.has('page') ? Number(searchParams.get('page')) : 1;
  const termFromUrl = searchParams.has('term') ? String(searchParams.get('term')) : '';

  const [term, setTerm] = useState(termFromUrl);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesCount, setMessagesCount] = useState(0);

  useEffect(() => {
    const messageParams = {
      destination: localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW),
      limit: INITIAL_LIMIT_BY_PAGE,
      offset: (currentPage - 1) * INITIAL_LIMIT_BY_PAGE,
      term,
    };

    getMessages(messageParams).then(({ result }) => {
      setMessages(result.messages);
      setMessagesCount(result.count);
    });
  }, [currentPage, term]);

  const handleSearch = (value: string) => {
    const path = `/messages/?page=1${value ? `&term=${value}` : ``}`;

    setTerm(value);
    setCurrentPage(1);
    navigate(path);
  };

  return (
    <div className="messages">
      <div className="pagination__wrapper">
        <span className="pagination__wrapper-caption">Total results: {messagesCount || 0}</span>
        <Pagination page={currentPage} count={messagesCount || 1} onPageChange={setCurrentPage} />
      </div>
      <div>
        <SearchForm term={term} placeholder="Find message by ID" handleSearch={handleSearch} />
        <br />
      </div>
      <MessagesList messages={messages} />
      <div className="pagination_bottom">
        <Pagination page={currentPage} count={messagesCount || 1} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};
