import { Filter } from 'components';
import styles from './Header.module.scss';

type Props = {
  text: string;
  filters: string[];
  filter: string;
  onFilterChange: (value: string) => void;
};

function Header({ text, filters, filter, onFilterChange }: Props) {
  return (
    <header className={styles.header}>
      <h2 className={styles.text}>{text}</h2>
      <Filter list={filters} value={filter} onChange={onFilterChange} />
    </header>
  );
}

export default Header;
