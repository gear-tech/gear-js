import { Link } from 'react-router-dom';
import styles from './Menu.module.scss';

function Menu() {
  return (
    <ul className={styles.menu}>
      <li>
        <Link to="/all">Show all</Link>
      </li>
    </ul>
  );
}

export { Menu };
