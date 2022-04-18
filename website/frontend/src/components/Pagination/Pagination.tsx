import React from 'react';
import { Button } from '@gear-js/ui';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import arrow from './images/arrow.svg';
import './Pagination.scss';

type Props = {
  page: number;
  count: number;
  onPageChange: (count: number) => void;
};

const Pagination = ({ page, count, onPageChange }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.has('query') ? String(searchParams.get('query')) : '';
  const totalPages = Math.ceil(count / INITIAL_LIMIT_BY_PAGE);
  const isDisabledPrev = page === 1;
  const isDisabledNext = page === totalPages || totalPages === 0;

  const handleClick = (newPage: number) => {
    setSearchParams({ page: String(newPage), query: queryFromUrl });
    onPageChange(newPage);
  };

  return (
    <div className="pagination">
      {!isDisabledPrev ? (
        <Button
          color="transparent"
          size="normal"
          icon={arrow}
          className="pagination--box pagination--box-prev"
          onClick={() => handleClick(page - 1)}
        />
      ) : (
        <div className={clsx('pagination--box', 'disabled')}>
          <img className="pagination--img-prev" src={arrow} alt="arrow" />
        </div>
      )}
      <button type="button" className="pagination--box selected">
        {page}
      </button>
      <p className="pagination__total">of {totalPages}</p>
      {!isDisabledNext ? (
        <Button
          color="transparent"
          size="normal"
          icon={arrow}
          className="pagination--box"
          onClick={() => handleClick(page + 1)}
        />
      ) : (
        <div className={clsx('pagination--box', 'disabled')}>
          <img src={arrow} alt="arrow" />
        </div>
      )}
    </div>
  );
};

export { Pagination };
