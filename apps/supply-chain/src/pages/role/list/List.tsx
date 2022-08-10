import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';
import styles from './List.module.scss';

type Props = {
  list: { name: string; isActive: boolean }[];
  value: string;
  onChange: (value: string) => void;
};

function List({ list, value, onChange }: Props) {
  const getItems = () =>
    list.map(({ name }) => (
      <li key={name}>
        <button
          type="button"
          className={clsx(buttonStyles.resets, styles.button, value === name && styles.active)}
          onClick={() => onChange(name)}>
          {name}
        </button>
      </li>
    ));

  return <ul className={styles.list}>{getItems()}</ul>;
}

export { List };
