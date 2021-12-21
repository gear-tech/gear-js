import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Pagination } from 'components/Pagination/Pagination';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { SearchForm } from '../../blocks/SearchForm/SearchForm';
import { MessageList } from '../../blocks/MessageList/MessageList';
import './Messages.scss';

export const Messages: VFC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const urlSearch = location.search;
  const pageFromUrl = urlSearch ? Number(urlSearch.split('=')[1]) : 1;

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  const messages = null;
  const messagesCount = null;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="messages">
      <div className="pagination__wrapper">
        <span className="pagination__wrapper-caption">Total results: {messagesCount || 0}</span>
        <Pagination page={currentPage} count={messagesCount || 1} onPageChange={onPageChange} />
      </div>
      <div>
        <SearchForm
          placeholder="Find message by ID"
          handleRemoveQuery={() => {
            setSearch('');
          }}
          handleSearch={(val: string) => {
            setSearch(val);
          }}
        />
        <br />
      </div>
      <div>
        <MessageList programId="12" programName="dfsdfsdf" />
      </div>
      <div className="pagination_bottom">
        <Pagination page={currentPage} count={messagesCount || 1} onPageChange={onPageChange} />
      </div>
    </div>
  );
};
