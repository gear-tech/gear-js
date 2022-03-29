import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApi } from 'hooks';
import { routes } from 'routes';
import clsx from 'clsx';
import styles from './Menu.module.scss';

type Props = {
  openSidebar: () => void;
};

type ClassNameProps = {
  isActive: boolean;
};

const Menu = ({ openSidebar }: Props) => {
  const { isApiReady } = useApi();

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
        <NavLink className={getClassName} to={routes.mailbox}>
          Mailbox
        </NavLink>
      </li>
    </ul>
  );
};

export { Menu };
