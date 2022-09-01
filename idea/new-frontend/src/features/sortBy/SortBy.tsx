import { memo } from 'react';
import { Button } from '@gear-js/ui';

import arrowDown from 'shared/assets/images/actions/arrowDown.svg';

import styles from './SortBy.module.scss';

type Props = {
  count: number;
  title: string;
};

const SortBy = memo(({ count, title }: Props) => (
  <div className={styles.content}>
    <h2 className={styles.title}>
      {title}: {count}
    </h2>
    <div className={styles.sortByWrapper}>
      <span className={styles.text}>Sort by</span>
      <Button icon={arrowDown} text="Last updated" color="transparent" className={styles.sortByBtn} />
    </div>
  </div>
));

export { SortBy };
