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
      <li className={styles.item} onClick={openSidebar}>
        {isApiReady ? localStorage.chain : 'Loading...'}
      </li>
      <li className={styles.item}>
        <Link to={routes.editor} className={styles.link}>
          &lt;/&gt; IDE
        </Link>
      </li>
    </ul>
  );
};

export { Menu };
