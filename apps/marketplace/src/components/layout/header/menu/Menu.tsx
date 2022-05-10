import { Link } from 'react-router-dom';
import styles from './Menu.module.scss';

function Menu() {
  return (
    <ul className={styles.menu}>
      <li>
        <Link to="/me">My collections</Link>
      </li>
      <li>
        <Link to="/create">Create collection</Link>
      </li>
    </ul>
  );
}

export default Menu;
