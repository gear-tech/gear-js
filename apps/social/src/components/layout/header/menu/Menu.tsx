import { Link } from 'react-router-dom';
import styles from './Menu.module.scss';

function Menu() {
  return (
    <ul className={styles.menu}>
      <li>
        <Link to="/my">My Channel</Link>
      </li>
      <li>
        <Link to="/all">Show all</Link>
      </li>
    </ul>
  );
}

export { Menu };
