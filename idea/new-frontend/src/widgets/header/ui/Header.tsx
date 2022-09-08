import { useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useLocation, matchPath } from 'react-router-dom';
import { useAccount } from '@gear-js/react-hooks';

import { AnimationTimeout } from 'shared/config';

import styles from './Header.module.scss';
import { PATHS_WITHOUT_BOTTOM_SIDE } from '../model/consts';
import { TopSide } from './topSide';
import { BottomSide } from './bottomSide';

const Header = () => {
  const { account } = useAccount();
  const { pathname } = useLocation();

  const withBottomSide = useMemo(
    () => !PATHS_WITHOUT_BOTTOM_SIDE.some((path) => Boolean(matchPath(path, pathname))),
    [pathname],
  );

  const isBottomSideVisible = withBottomSide && Boolean(account);

  return (
    <CSSTransition in={isBottomSideVisible} exit={withBottomSide} timeout={AnimationTimeout.Default}>
      <header className={styles.header}>
        <TopSide account={account} />
        <CSSTransition
          in={isBottomSideVisible}
          exit={false}
          timeout={AnimationTimeout.Default}
          mountOnEnter
          unmountOnExit>
          <BottomSide />
        </CSSTransition>
      </header>
    </CSSTransition>
  );
};

export { Header };
