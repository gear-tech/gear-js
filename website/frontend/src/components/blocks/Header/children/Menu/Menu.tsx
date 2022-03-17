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

type ClassNameProps = {
  isActive: boolean;
};

const Menu = ({ openSidebar }: Props) => {
  const { isApiReady } = useSelector((state: RootState) => state.api);

  const getClassName = ({ isActive }: ClassNameProps) => clsx(styles.link, isActive && styles.active);

  return (
    <ul className={styles.menu}>
      <li>
        <span className={styles.link} onClick={openSidebar}>
          {isApiReady ? localStorage.chain : 'Loading...'}
        </span>
      </li>
      <li>
        <NavLink className={getClassName} to={routes.explorer}>
          Explorer
        </NavLink>
      </li>
      <li>
        <NavLink className={getClassName} to={routes.editor}>
          &lt;/&gt; IDE
        </NavLink>
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
