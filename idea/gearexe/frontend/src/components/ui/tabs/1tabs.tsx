import { Button } from '../button/1button';
import styles from './tabs.module.scss';

type Props = {
  tabs: string[];
  tabIndex: number;
  onTabIndexChange: (tabIndex: number) => void;
};

const Tabs = ({ tabs, tabIndex, onTabIndexChange }: Props) => {
  return (
    <div className={styles.container}>
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
