import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createSelector } from 'reselect';
import { MessagesList } from 'components/blocks/MessagesList/MessagesList';
import { Pagination } from 'components/Pagination/Pagination';
import { getMessagesAction } from 'store/actions/actions';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { RootState } from 'store/reducers';
import { SearchForm } from '../../blocks/SearchForm/SearchForm';
import { LOCAL_STORAGE } from 'consts';
import './Messages.scss';

const selectMessages = createSelector(
  (state: RootState) => state.messages,
  (_ignore: any, completed: string) => completed,
  (messages, completed) => messages.messages && messages.messages.filter((message) => message.id.includes(completed))
);

export const Messages: VFC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = searchParams.has('page') ? Number(searchParams.get('page')) : 1;

  const [search, setSearch] = useState('');

  const { messagesCount } = useSelector((state: RootState) => state.messages);
  const messages = useSelector((state: RootState) => selectMessages(state, search));

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
      })
    );
  }, [dispatch, offset]);

  return (
    <div className="messages">
      <div className="pagination__wrapper">
        <span className="pagination__wrapper-caption">Total results: {messagesCount || 0}</span>
        <Pagination page={currentPage} count={messagesCount || 1} onPageChange={onPageChange} />
      </div>
      <div>
        <SearchForm
          handleRemoveQuery={() => {
            setSearch('');
          }}
          handleSearch={(val: string) => {
            setSearch(val);
          }}
          placeholder="Find message by ID"
        />
        <br />
      </div>
      <MessagesList messages={messages} />
      <div className="pagination_bottom">
        <Pagination page={currentPage} count={messagesCount || 1} onPageChange={onPageChange} />
      </div>
    </div>
  );
};
