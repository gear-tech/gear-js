import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';
import { ACTION_ICONS } from 'consts';
import styles from './List.module.scss';

type Props = {
  list: string[];
  value: string;
  onChange: (value: string) => void;
};

function List({ list, value, onChange }: Props) {
  const getItems = () =>
    list.map((item) => {
      const SVG = ACTION_ICONS[item];
      const isActive = value === item;

      const buttonClassName = clsx(buttonStyles.resets, styles.button, isActive && styles.active);
      const iconClassName = clsx(styles.icon, isActive && styles.active);

      return (
        <li key={item}>
          <button type="button" className={buttonClassName} onClick={() => onChange(item)}>
            {SVG && <SVG className={iconClassName} />}
            {item}
          </button>
        </li>
      );
    });

  return <ul className={styles.list}>{getItems()}</ul>;
}

export { List };
