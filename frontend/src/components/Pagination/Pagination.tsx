import React from 'react';
import clsx from 'clsx';

import { INITIAL_LIMIT_BY_PAGE } from 'consts';

import { PaginationArrow } from 'Icons';

import './Pagination.scss';

type Props = {
    page: number;
    count: number;
    onPageChange: (count: number) => void;
};

const Pagination = ({ 
    page,
    count,
    onPageChange}: Props) => {

    const totalPages = Math.ceil(count / INITIAL_LIMIT_BY_PAGE);

    const isDisabledPrev = page === 0;
    const isDisabledNext = page === totalPages - 1;

    const onPreviousClickHandler = () => {
        onPageChange(page - 1);
    };

    const onNextClickHandler = () => {
        onPageChange(page + 1);
    };

    return (
        <div className="pagination">
            <button type="button" className={clsx("pagination--box", isDisabledPrev && "disabled")} onClick={onPreviousClickHandler} disabled={isDisabledPrev}>
                <PaginationArrow color="#C4CDD5"/>
            </button> 
            <button type="button" className="pagination--box selected">
                {page + 1}
            </button>
            <p className="pagination__total">of {totalPages}</p>
            <button type="button" className={clsx("pagination--box", isDisabledNext && "disabled")} onClick={onNextClickHandler} disabled={isDisabledNext}>
                <PaginationArrow color="#C4CDD5"/>
            </button>
        </div>
    )
}

export { Pagination };