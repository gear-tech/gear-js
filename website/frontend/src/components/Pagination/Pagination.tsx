import React from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import arrow from './images/arrow.svg';
import { URL_PARAMS } from 'consts';
import './Pagination.scss';

type Props = {
  count: number;
};

const Pagination = ({ count }: Props) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const pageFromUrl = searchParams.has(URL_PARAMS.PAGE) ? Number(searchParams.get(URL_PARAMS.PAGE)) : 1;
  const queryFromUrl = searchParams.has(URL_PARAMS.QUERY) ? String(searchParams.get(URL_PARAMS.QUERY)) : '';
  const totalPages = Math.ceil(count / INITIAL_LIMIT_BY_PAGE);
  const isDisabledPrev = pageFromUrl === 1;
  const isDisabledNext = pageFromUrl === totalPages || totalPages === 0;

  const getUrl = (isPrevPage: boolean) => {
    const newPage = isPrevPage ? pageFromUrl - 1 : pageFromUrl + 1;
    const pageParam = `${URL_PARAMS.PAGE}=${newPage}`;
    const queryParam = queryFromUrl && `&${URL_PARAMS.QUERY}=${queryFromUrl}`;

    return `${location.pathname}?${pageParam}${queryParam}`;
  };

  return (
    <div className="pagination">
      {!isDisabledPrev ? (
        <Link className="pagination--box" to={getUrl(true)}>
          <img className="pagination--img-prev" src={arrow} alt="arrow" />
        </Link>
      ) : (
        <div className={clsx('pagination--box', 'disabled')}>
          <img className="pagination--img-prev" src={arrow} alt="arrow" />
        </div>
      )}
      <button type="button" className="pagination--box selected">
        {pageFromUrl}
      </button>
      <p className="pagination__total">of {totalPages}</p>
      {!isDisabledNext ? (
        <Link className="pagination--box" to={getUrl(false)}>
          <img className="pagination--img" src={arrow} alt="arrow" />
        </Link>
      ) : (
        <div className={clsx('pagination--box', 'disabled')}>
          <img src={arrow} alt="arrow" />
        </div>
      )}
    </div>
  );
};

export { Pagination };
