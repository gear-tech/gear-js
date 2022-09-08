import { memo } from 'react';
import { CSSTransition } from 'react-transition-group';

import { AnimationTimeout } from 'shared/config';
import { SwitchButton } from 'shared/ui/switchButton';

import styles from './ProgramsFilter.module.scss';
import { Filter } from '../../model/consts';

type Props = {
  value: Filter;
  onClick: (value: Filter) => void;
};

const ProgramsFilter = memo(({ value, onClick }: Props) => {
  const handleClick = (filter: Filter) => () => onClick(filter);

  return (
    <div className={styles.filters}>
      <CSSTransition in appear timeout={AnimationTimeout.Default}>
        <SwitchButton
          text="All"
          isActive={value === Filter.AllPrograms}
          className={styles.filterBtn}
          onClick={handleClick(Filter.AllPrograms)}
        />
      </CSSTransition>
      <CSSTransition in appear timeout={AnimationTimeout.Default + 50}>
        <SwitchButton
          text="My programs"
          isActive={value === Filter.MyPrograms}
          className={styles.filterBtn}
          onClick={handleClick(Filter.MyPrograms)}
        />
      </CSSTransition>
    </div>
  );
});

export { ProgramsFilter };
