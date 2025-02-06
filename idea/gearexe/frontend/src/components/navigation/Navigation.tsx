import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { routes } from '@/shared/config';
import { Search } from '@/features/search/ui/Search';
import styles from './Navigation.module.scss';

const navigation = [
  { title: 'Home', to: routes.home },
  { title: 'Programs', to: routes.programs },
  { title: 'Codes', to: routes.codes },
];

const Navigation = () => {
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
      <Search />
    </div>
  );
};

export { Navigation };
