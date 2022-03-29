import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessagesList } from 'components/blocks/MessagesList/MessagesList';
import { Pagination } from 'components/Pagination/Pagination';
import { getMessagesAction } from 'store/actions/actions';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { RootState } from 'store/reducers';
import { SearchForm } from '../../blocks/SearchForm/SearchForm';
import { LOCAL_STORAGE } from 'consts';
import './Messages.scss';

export const Messages: VFC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = searchParams.has('page') ? Number(searchParams.get('page')) : 1;
  const termFromUrl = searchParams.has('term') ? String(searchParams.get('term')) : '';

  const messages = useSelector((state: RootState) => state.messages.messages);
  const messagesCount = useSelector((state: RootState) => state.messages.messagesCount);

  const [term, setTerm] = useState(termFromUrl);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const offset = (currentPage - 1) * INITIAL_LIMIT_BY_PAGE;

  useEffect(() => {
    dispatch(
      getMessagesAction({
        destination: localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW),
        limit: INITIAL_LIMIT_BY_PAGE,
        offset,
        term,
      })
    );
  }, [dispatch, offset, term]);

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
        <Pagination page={currentPage} count={messagesCount || 1} onPageChange={onPageChange} />
      </div>
      <div>
        <SearchForm term={term} placeholder="Find message by ID" handleSearch={handleSearch} />
        <br />
      </div>
      <MessagesList messages={messages} />
      <div className="pagination_bottom">
        <Pagination page={currentPage} count={messagesCount || 1} onPageChange={onPageChange} />
      </div>
    </div>
  );
};
