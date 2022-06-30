import { Filter as FilterType } from 'types';
import { Filter } from '../filter';
import styles from './Header.module.scss';

type Props = {
  text: string;
  filter?: FilterType;
};

function Header({ text, filter }: Props) {
  return (
    <header className={styles.header}>
      <h2 className={styles.text}>{text}</h2>
      {filter && <Filter value={filter.value} list={filter.list} onChange={filter.onChange} />}
    </header>
  );
}

export { Header };
