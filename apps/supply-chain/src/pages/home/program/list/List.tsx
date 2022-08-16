import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';
import styles from './List.module.scss';

type Props = {
  list: string[];
  value: string;
  onChange: (value: string) => void;
};

function List({ list, value, onChange }: Props) {
  const getItems = () =>
    list.map((item) => (
      <li key={item}>
        <button
          type="button"
          className={clsx(buttonStyles.resets, styles.button, value === item && styles.active)}
          onClick={() => onChange(item)}>
          {item}
        </button>
      </li>
    ));

  return <ul className={styles.list}>{getItems()}</ul>;
}

export { List };
