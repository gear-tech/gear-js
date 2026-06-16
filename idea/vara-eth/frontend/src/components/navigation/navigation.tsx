import { clsx } from 'clsx';
import { generatePath, matchPath, NavLink, useLocation } from 'react-router-dom';
import type { Hex } from 'viem';

import { UploadCodeButton } from '@/features/codes';
import { Search } from '@/features/search';
import { routes } from '@/shared/config';

import { buttonStyles } from '../ui/button';

import styles from './navigation.module.scss';

const LINKS = [
  { title: 'Home', to: routes.home },
  { title: 'Programs', to: routes.programs },
  { title: 'Codes', to: routes.codes },
] as const;

const Navigation = () => {
  const { pathname } = useLocation();
  const codeId = matchPath(routes.code, pathname)?.params.codeId as Hex | undefined;

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

        {matchPath(routes.codes, pathname) && <UploadCodeButton />}

        {codeId && (
          <NavLink
            to={generatePath(routes.createProgram, { codeId })}
            className={clsx(
              styles.createProgramLink,
              buttonStyles.button,
              buttonStyles['btn--variant-default'],
              buttonStyles['size-xs'],
            )}>
            Create program
          </NavLink>
        )}
      </div>

      {/* key to reset search on route change */}
      <Search key={pathname} />
    </div>
  );
};

export { Navigation };
