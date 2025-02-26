import clsx from 'clsx';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import { routes } from '@/shared/config';

import styles from './navigation.module.scss';

const navigation = [
  { title: 'Home', to: routes.home },
  { title: 'Programs', to: routes.programs },
  { title: 'Codes', to: routes.codes },
];

type Props = {
  search: ReactNode;
  action?: ReactNode;
};

const Navigation = ({ search, action }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSide}>
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
        {action}
      </div>

      {search}
    </div>
  );
};

export { Navigation };
