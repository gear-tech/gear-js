import React, { VFC } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { PaginationArrow } from 'assets/Icons';
import './Pagination.scss';

type Props = {
  page: number;
  count: number;
  onPageChange: (count: number) => void;
  setShouldReload?: (value: boolean) => void;
};

export const Pagination: VFC<Props> = ({ page, count, onPageChange, setShouldReload }) => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const termFromUrl = searchParams.has('term') ? String(searchParams.get('term')) : '';
  const totalPages = Math.ceil(count / INITIAL_LIMIT_BY_PAGE);
  const isDisabledPrev = page === 1;
  const isDisabledNext = page === totalPages || totalPages === 0;

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

  const getUrl = (newPage: number) => {
    return `${pathname}?page=${newPage}${termFromUrl ? `&term=${termFromUrl}` : ``}`;
  };

  return (
    <div className="pagination">
      {!isDisabledPrev ? (
        <Link className="pagination--box" to={getUrl(page - 1)} onClick={onPreviousClickHandler}>
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
        <Link className="pagination--box" to={getUrl(page + 1)} onClick={onNextClickHandler}>
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
