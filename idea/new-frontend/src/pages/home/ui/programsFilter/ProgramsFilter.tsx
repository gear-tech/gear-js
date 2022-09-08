import { SwitchButton } from 'shared/ui/switchButton';

import styles from './ProgramsFilter.module.scss';
import { Filter } from '../../model/consts';

type Props = {
  value: Filter;
  onClick: (value: Filter) => void;
};

const ProgramsFilter = ({ value, onClick }: Props) => {
  const handleClick = (filter: Filter) => () => onClick(filter);

  return (
    <div className={styles.filters}>
      <SwitchButton text="All" isActive={value === Filter.AllPrograms} onClick={handleClick(Filter.AllPrograms)} />
      <SwitchButton
        text="My programs"
        isActive={value === Filter.MyPrograms}
        onClick={handleClick(Filter.MyPrograms)}
      />
    </div>
  );
};

export { ProgramsFilter };
