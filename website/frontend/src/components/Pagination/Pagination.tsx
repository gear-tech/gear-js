import React from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import arrow from './images/arrow.svg';
import { URL_PARAMS } from 'consts';
import './Pagination.scss';

type Props = {
  currentPage: number;
  count: number;
};

const Pagination = ({ currentPage, count }: Props) => {
  const [searchParams] = useSearchParams();
  const { pathname: url } = useLocation();

  const totalPages = Math.ceil(count / INITIAL_LIMIT_BY_PAGE);
  const isDisabledPrev = currentPage === 1;
  const isDisabledNext = currentPage === totalPages || totalPages === 0;

  const getUrl = (isPrevPage: boolean) => {
    const newPage = isPrevPage ? currentPage - 1 : currentPage + 1;
    searchParams.set(URL_PARAMS.PAGE, String(newPage));

    return `${url}?${searchParams.toString()}`;
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
        {currentPage}
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
