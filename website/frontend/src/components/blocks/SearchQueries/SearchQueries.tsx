import React, { VFC } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { routes } from 'routes';
import { SEARCH_DROPDOWN } from 'fixtures';
import { SearchQueryModel } from 'types/common';
import RemoveQueryIcon from 'assets/images/remove-query.svg';
import './SearchQueries.scss';

type Props = {
  searchQuery: SearchQueryModel;
  handleRemoveQuery: () => void;
};

export const SearchQueries: VFC<Props> = ({ searchQuery, handleRemoveQuery }) => {
  const isNotificationsPage = useRouteMatch(routes.notifications);

  const queryType = isNotificationsPage ? SEARCH_DROPDOWN[searchQuery.type].split(' ').pop() : 'hash';
  return (
    <div className="search-queries">
      <div className="search-query">
        <span>
          {queryType}: {searchQuery.query}
        </span>
        <button className="search-query__remove" type="button" onClick={() => handleRemoveQuery()}>
          <img src={RemoveQueryIcon} alt="remove-query" />
        </button>
      </div>
    </div>
  );
};
