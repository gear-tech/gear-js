import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { RootState } from 'store/reducers';
import styles from './Menu.module.scss';

type Props = {
  openSidebar: () => void;
};

const Menu = ({ openSidebar }: Props) => {
  const { isApiReady } = useSelector((state: RootState) => state.api);

  return (
    <ul className={styles.menu}>
      <li>
        <span className={styles.link} onClick={openSidebar}>
          {isApiReady ? localStorage.chain : 'Loading...'}
        </span>
      </li>
      <li>
        <Link to={routes.explorer} className={styles.link}>
          Explorer
        </Link>
      </li>
      <li>
        <Link to={routes.editor} className={styles.link}>
          &lt;/&gt; IDE
        </Link>
      </li>
      <li>
        <Link to={routes.mailbox} className={styles.link}>
          Mailbox
        </Link>
      </li>
    </ul>
  );
};

export { Menu };
