import { memo } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { Button } from '@gear-js/ui';

import { ANIMATION_TIMEOUT } from 'shared/config';

import styles from './ProgramsFilter.module.scss';
import { Filter } from '../../model/consts';

type Props = {
  value: Filter;
  onClick: (value: Filter) => void;
};

const ProgramsFilter = memo(({ value, onClick }: Props) => {
  const handleClick = (filter: Filter) => () => onClick(filter);

  const getFilterClasses = (filter: Filter) => clsx(styles.filterBtn, filter === value && styles.active);

  return (
    <div className={styles.filters}>
      <CSSTransition in appear timeout={ANIMATION_TIMEOUT}>
        <div className={styles.filterWrapper}>
          <Button
            size="small"
            text="All"
            color="transparent"
            className={getFilterClasses(Filter.AllPrograms)}
            onClick={handleClick(Filter.AllPrograms)}
          />
        </div>
      </CSSTransition>
      <CSSTransition in appear timeout={ANIMATION_TIMEOUT + 50}>
        <div className={styles.filterWrapper}>
          <Button
            size="small"
            text="My programs"
            color="transparent"
            className={getFilterClasses(Filter.MyPrograms)}
            onClick={handleClick(Filter.MyPrograms)}
          />
        </div>
      </CSSTransition>
    </div>
  );
});

export { ProgramsFilter };
