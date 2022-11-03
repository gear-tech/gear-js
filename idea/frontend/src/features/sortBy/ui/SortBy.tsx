import { useState } from 'react';
import clsx from 'clsx';
import { Button } from '@gear-js/ui';

import arrowDown from 'shared/assets/images/actions/arrowDown.svg';

import styles from './SortBy.module.scss';
import { Sort } from '../model/consts';

type Props = {
  count: number;
  title: string;
  onChange: (value: Sort) => void;
};

const SortBy = ({ count, title, onChange }: Props) => {
  const [sortBy, setSortBy] = useState(Sort.Last);

  const toggleSort = () => {
    const value = sortBy === Sort.Last ? Sort.First : Sort.Last;

    setSortBy(value);
    onChange(value);
  };

  const buttonText = sortBy === Sort.Last ? 'Last updated' : 'First updated';

  return (
    <div className={styles.content}>
      <h2 className={styles.title}>
        {title}: {count}
      </h2>
      <div className={styles.sortByWrapper}>
        <span className={styles.text}>Sort by</span>
        <Button
          icon={arrowDown}
          text={buttonText}
          color="transparent"
          className={clsx(styles.sortByBtn, styles[sortBy])}
          onClick={toggleSort}
        />
      </div>
    </div>
  );
};

export { SortBy };
