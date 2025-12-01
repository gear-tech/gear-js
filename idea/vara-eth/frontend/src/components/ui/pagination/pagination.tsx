import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';
import { Button } from '@/components';

import styles from './pagination.module.scss';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: (prevPage: number) => number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    onPageChange((prevPage) => prevPage - 1);
  };

  const handleNext = () => {
    onPageChange((prevPage) => prevPage + 1);
  };

  return (
    <div className={styles.pagination}>
      <Button variant="icon" onClick={handlePrev} disabled={currentPage === 1}>
        <ArrowLeftSVG />
      </Button>

      <span className={styles.info}>
        {currentPage} of {totalPages}
      </span>

      <Button variant="icon" className={styles.nextButton} onClick={handleNext} disabled={currentPage === totalPages}>
        <ArrowLeftSVG />
      </Button>
    </div>
  );
};

export { Pagination };
