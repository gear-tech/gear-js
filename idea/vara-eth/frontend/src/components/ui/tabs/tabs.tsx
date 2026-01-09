import { clsx } from 'clsx';

import { Button } from '../button/button';

import styles from './tabs.module.scss';

type Props = {
  tabs: string[];
  tabIndex: number;
  onTabIndexChange: (tabIndex: number) => void;
  className?: string;
};

const Tabs = ({ tabs, tabIndex, onTabIndexChange, className }: Props) => {
  return (
    <div className={clsx(styles.container, className)}>
      {tabs.map((name, index) => {
        const isSelected = tabIndex === index;
        return (
          <Button
            key={name}
            variant={isSelected ? 'secondary' : 'outline'}
            className={styles.button}
            size="xs"
            onClick={() => onTabIndexChange(index)}>
            {name}
          </Button>
        );
      })}
    </div>
  );
};

export { Tabs };
