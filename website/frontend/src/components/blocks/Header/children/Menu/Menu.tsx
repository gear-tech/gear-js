import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { routes } from 'routes';
import clsx from 'clsx';
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
        <NavLink
          className={({ isActive }) => (isActive ? clsx(styles.link, styles.active) : styles.link)}
          to={routes.explorer}
        >
          Explorer
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? clsx(styles.link, styles.active) : styles.link)}
          to={routes.editor}
        >
          &lt;/&gt; IDE
        </NavLink>
      </li>
    </ul>
  );
};

export { Menu };
