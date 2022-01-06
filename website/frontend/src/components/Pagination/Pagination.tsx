import React, { VFC } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import clsx from 'clsx';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { PaginationArrow } from 'assets/Icons';
import { routes } from 'routes';
import './Pagination.scss';

type Props = {
  page: number;
  count: number;
  onPageChange: (count: number) => void;
  setShouldReload?: (value: boolean) => void;
};

export const Pagination: VFC<Props> = ({ page, count, onPageChange, setShouldReload }) => {
  const totalPages = Math.ceil(count / INITIAL_LIMIT_BY_PAGE);
  const isDisabledPrev = page === 1;
  const isDisabledNext = page === totalPages || totalPages === 0;
  const isAllProgramsPage = useRouteMatch(routes.allPrograms);
  const isAllMessagesPage = useRouteMatch(routes.messages);
  let url = routes.uploadedPrograms;

  if (isAllProgramsPage) {
    url = routes.allPrograms;
  } else if (isAllMessagesPage) {
    url = routes.messages;
  }
  console.log(url);
  const onPreviousClickHandler = () => {
    if (setShouldReload) {
      setShouldReload(true);
    }
    onPageChange(page - 1);
  };

  const onNextClickHandler = () => {
    if (setShouldReload) {
      setShouldReload(true);
    }
    onPageChange(page + 1);
  };

  return (
    <div className="pagination">
      {!isDisabledPrev ? (
        <Link className="pagination--box" to={`${url}/?p=${page - 1}`} onClick={onPreviousClickHandler}>
          <PaginationArrow color="#C4CDD5" />
        </Link>
      ) : (
        <div className={clsx('pagination--box', 'disabled')}>
          <PaginationArrow color="#C4CDD5" />
        </div>
      )}
      <button type="button" className="pagination--box selected">
        {page}
      </button>
      <p className="pagination__total">of {totalPages}</p>
      {!isDisabledNext ? (
        <Link className="pagination--box" to={`${url}/?p=${page + 1}`} onClick={onNextClickHandler}>
          <PaginationArrow color="#C4CDD5" />
        </Link>
      ) : (
        <div className={clsx('pagination--box', 'disabled')}>
          <PaginationArrow color="#C4CDD5" />
        </div>
      )}
    </div>
  );
};

Pagination.defaultProps = {
  setShouldReload: undefined,
};
