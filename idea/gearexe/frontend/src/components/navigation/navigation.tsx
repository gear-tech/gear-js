import clsx from 'clsx';
import { JSX } from 'react';
import { NavLink } from 'react-router-dom';

import { routes } from '@/shared/config';

import styles from './navigation.module.scss';

const navigation = [
  { title: 'Home', to: routes.home },
  { title: 'Programs', to: routes.programs },
  { title: 'Codes', to: routes.codes },
];

type Props = {
  search: JSX.Element;
};

const Navigation = ({ search }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.navigation}>
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => clsx(styles.navigationItem, isActive && styles.active)}>
            [{item.title}]
          </NavLink>
        ))}
      </div>

      {search}
    </div>
  );
};

export { Navigation };
