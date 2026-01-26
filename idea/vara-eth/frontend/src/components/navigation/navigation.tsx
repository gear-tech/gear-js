import { HexString } from '@vara-eth/api';
import { clsx } from 'clsx';
import { matchPath, NavLink, useLocation } from 'react-router-dom';

import { CreateProgramButton } from '@/features/programs';
import { Search } from '@/features/search';
import { routes } from '@/shared/config';

import styles from './navigation.module.scss';

const LINKS = [
  { title: 'Home', to: routes.home },
  { title: 'Programs', to: routes.programs },
  { title: 'Codes', to: routes.codes },
] as const;

const Navigation = () => {
  const { pathname } = useLocation();
  const codeId = matchPath(routes.code, pathname)?.params.codeId as HexString | undefined;

  const renderLinks = () =>
    LINKS.map(({ to, title }) => (
      <NavLink key={to} to={to} className={({ isActive }) => clsx(styles.navigationItem, isActive && styles.active)}>
        [{title}]
      </NavLink>
    ));

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSide}>
        <div className={styles.navigation}>{renderLinks()}</div>

        {codeId && <CreateProgramButton codeId={codeId} />}
      </div>

      {/* key to reset search on route change */}
      <Search key={pathname} />
    </div>
  );
};

export { Navigation };
