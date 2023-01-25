import { useMemo, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useLocation, matchPath } from 'react-router-dom';
import { useAccount } from '@gear-js/react-hooks';

import { AnimationTimeout } from 'shared/config';

import styles from './Header.module.scss';
import { FULL_HEADER_HEIGHT, SHORT_HEADER_HEIGHT, PATHS_WITHOUT_BOTTOM_SIDE } from '../model/consts';
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

  useEffect(() => {
    const currentHeight = isBottomSideVisible ? FULL_HEADER_HEIGHT : SHORT_HEADER_HEIGHT;

    document.documentElement.style.setProperty('--header-height', currentHeight);
  }, [isBottomSideVisible]);

  return (
    <header className={styles.header}>
      <TopSide />
      <CSSTransition
        in={isBottomSideVisible}
        exit={withBottomSide}
        timeout={AnimationTimeout.Small}
        mountOnEnter
        unmountOnExit>
        <BottomSide />
      </CSSTransition>
    </header>
  );
};

export { Header };
