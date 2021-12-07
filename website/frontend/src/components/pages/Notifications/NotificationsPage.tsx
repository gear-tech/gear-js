import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  getNotificationsAction,
  getUnreadNotificationsCount,
  markAllRecentNotificationsAsReadAction,
  markCertainRecentNotificationsAsReadAction,
  resetBlocksAction,
} from 'store/actions/actions';
import { RootState } from 'store/reducers';

import { formatDate } from 'helpers';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { PaginationModel, SearchQueryModel } from 'types/common';
import { NotificationModel } from 'types/notification';

import { SearchForm } from 'components/blocks/SearchForm/SearchForm';
import { Pagination } from 'components/Pagination/Pagination';
import { NotificationInfo } from 'components/NotificationInfo/NotificationInfo';
import { ReadNotificationsIcon, UnReadNotificationsIcon } from 'assets/Icons';
import { SearchQueries } from 'components/blocks/SearchQueries/SearchQueries';

import './NotificationsPage.scss';

export const NotificationsPage: VFC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const urlSearch = location.search;
  const pageFromUrl = urlSearch ? Number(urlSearch.split('=')[1]) : 1;

  const { notifications, count, countUnread } = useSelector((state: RootState) => state.notifications);

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [searchQuery, setSearchQuery] = useState<SearchQueryModel | null>(null);
  const [searchType, setSearchType] = useState(0);
  const [shouldReload, setShouldReload] = useState(true);
  const [notificationInfo, setNotificationInfo] = useState<NotificationModel | null>(null);

  const offset = (currentPage - 1) * INITIAL_LIMIT_BY_PAGE;

  const onPageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    const params: PaginationModel = { limit: INITIAL_LIMIT_BY_PAGE, offset };
    if (searchQuery) {
      params.type = searchQuery.query;
    }
    if (shouldReload) {
      dispatch(getNotificationsAction({ limit: INITIAL_LIMIT_BY_PAGE, offset, type: searchQuery?.query }));
      dispatch(getUnreadNotificationsCount());
      setShouldReload(false);
    }
  }, [dispatch, offset, shouldReload, searchQuery, setShouldReload]);

  useEffect(
    () => () => {
      dispatch(resetBlocksAction());
    },
    [dispatch]
  );

  const handleReadAllNotifications = () => {
    dispatch(markAllRecentNotificationsAsReadAction());
    window.location.reload();
  };

  const handleAddQuery = (value: string) => {
    if ((searchQuery && searchQuery.query !== value) || !searchQuery) {
      setSearchQuery({ type: searchType, query: value });
      setShouldReload(true);
    }
  };

  const handleRemoveQuery = () => {
    setSearchQuery(null);
    setShouldReload(true);
  };

  const handleSearchType = (index: number) => {
    setSearchType(index);
  };

  const handleReadNotification = (isRead: boolean, id: string) => {
    if (isRead) return;
    dispatch(markCertainRecentNotificationsAsReadAction([id]));
    setShouldReload(true);
  };

  const handleNotificationInfo = (notification: NotificationModel | null) => {
    if (notification && notification.type.toLowerCase() !== 'log') return;
    setNotificationInfo(notification);
  };

  if (notificationInfo) {
    return <NotificationInfo notification={notificationInfo} handleNotificationInfo={handleNotificationInfo} />;
  }

  return (
    <div className="notifications">
      <SearchForm
        handleSearch={handleAddQuery}
        handleRemoveQuery={handleRemoveQuery}
        handleDropdownItemSelect={handleSearchType}
        searchType={searchType}
      />
      {(searchQuery && <SearchQueries searchQuery={searchQuery} handleRemoveQuery={handleRemoveQuery} />) || null}
      <div className="pagination-wrapper">
        <div>
          <span>Total results: {count || 0}</span>
          {(countUnread && countUnread > 0 && (
            <button type="button" onClick={() => handleReadAllNotifications()} className="pagination-wrapper__btn">
              <UnReadNotificationsIcon color="#ffffff" />
              Mark all us viewed
            </button>
          )) ||
            null}
        </div>
        <Pagination
          page={currentPage}
          count={count || 1}
          onPageChange={onPageChange}
          setShouldReload={setShouldReload}
        />
      </div>
      <div className="notifications--list">
        {(notifications &&
          notifications.length &&
          notifications.map((item) => (
            <button
              className={clsx('notification', !item.isRead && 'unread', item.type.toLowerCase() !== 'log' && 'default')}
              onClick={() => handleNotificationInfo(item)}
              type="button"
            >
              <span className="notification__type">
                {item.isRead || <div className={clsx('dot unread', item.type === 'InitFailure' && 'warning')} />}
                {item.type}
              </span>
              <span className="notification__program">{item.id}</span>
              <span className="notification__date">{formatDate(item.date)}</span>
              <button
                className="notification__read"
                type="button"
                onClick={() => handleReadNotification(item.isRead, item.id)}
              >
                {(item.isRead && <ReadNotificationsIcon color="#858585" />) || (
                  <UnReadNotificationsIcon color="#858585" />
                )}
              </button>
            </button>
          ))) ||
          null}
      </div>
      {(notifications && notifications.length && (
        <div className="pagination-bottom">
          <Pagination
            page={currentPage}
            count={count || 1}
            onPageChange={onPageChange}
            setShouldReload={setShouldReload}
          />
        </div>
      )) ||
        null}
    </div>
  );
};
