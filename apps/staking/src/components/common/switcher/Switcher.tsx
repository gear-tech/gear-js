import clsx from 'clsx';

import styles from './Switcher.module.scss';
import { SwitchItem } from './types';

type Props = {
  value: string;
  items: SwitchItem[];
  onChange: (value: string) => void;
};

function Switcher({ value: currentValue, items, onChange }: Props) {
  const getClasses = (value: string) => clsx(styles.switchBtn, value === currentValue && styles.active);

  return (
    <ul className={styles.switcher}>
      {items.map(({ value, label }) => (
        <li key={value}>
          <button type="button" className={getClasses(value)} onClick={() => onChange(value)}>
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export { Switcher };
