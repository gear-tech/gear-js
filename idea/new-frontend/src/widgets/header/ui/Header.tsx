import { useMemo } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { useAccount } from '@gear-js/react-hooks';

import styles from './Header.module.scss';
import { PATHS_WITHOUT_BOTTOM_SIDE } from '../model/consts';
import { TopSide } from './topSide';
import { BottomSide } from './bottomSide';

const Header = () => {
  const { account } = useAccount();
  const { pathname } = useLocation();

  const withoutBottomSide = useMemo(
    () => PATHS_WITHOUT_BOTTOM_SIDE.some((path) => Boolean(matchPath(path, pathname))),
    [pathname],
  );

  const isBottomSideVisible = !withoutBottomSide && Boolean(account);

  return (
    <header className={styles.header}>
      <TopSide account={account} />
      <BottomSide isVisible={isBottomSideVisible} />
    </header>
  );
};

export { Header };
