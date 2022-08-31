import { memo } from 'react';
import { Button } from '@gear-js/ui';

import arrowDown from 'shared/assets/images/actions/arrowDown.svg';

import styles from './SortBy.module.scss';

type Props = {
  count: number;
};

const SortBy = memo(({ count }: Props) => (
  <div className={styles.content}>
    <h2 className={styles.title}>Programs: {count}</h2>
    <div className={styles.sortByWrapper}>
      <span className={styles.text}>Sort by</span>
      <Button icon={arrowDown} text="Last updated" color="transparent" className={styles.sortByBtn} />
    </div>
  </div>
));

export { SortBy };
