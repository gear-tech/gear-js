import React from 'react';
import { Link } from 'react-router-dom';
import { useApi } from 'hooks';
import { routes } from 'routes';
import styles from './Menu.module.scss';

type Props = {
  openSidebar: () => void;
};

const Menu = ({ openSidebar }: Props) => {
  const { isApiReady } = useApi();

  return (
    <ul className={styles.menu}>
      <li>
        <span className={styles.link} onClick={openSidebar}>
          {isApiReady ? localStorage.chain : 'Loading...'}
        </span>
      </li>
      <li>
        <Link to="/explorer" className={styles.link}>
          Explorer
        </Link>
      </li>
      <li>
        <Link to={routes.editor} className={styles.link}>
          &lt;/&gt; IDE
        </Link>
      </li>
    </ul>
  );
};

export { Menu };
