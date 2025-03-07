import { useAccount, useApi } from '@gear-js/react-hooks';
import { useMemo, useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

import { AnimationTimeout } from '@/shared/config';
import { CSSTransitionWithRef } from '@/shared/ui';

import { FULL_HEADER_HEIGHT, SHORT_HEADER_HEIGHT, PATHS_WITHOUT_BOTTOM_SIDE } from '../model/consts';

import styles from './Header.module.scss';
import { BottomSide } from './bottomSide';
import { TopSide } from './topSide';

const Header = () => {
  const { isApiReady } = useApi();
  const { account } = useAccount();
  const { pathname } = useLocation();

  const withBottomSide = useMemo(
    () => !PATHS_WITHOUT_BOTTOM_SIDE.some((path) => Boolean(matchPath(path, pathname))),
    [pathname],
  );

  const isBottomSideVisible = withBottomSide && Boolean(isApiReady) && Boolean(account);

  useEffect(() => {
    const currentHeight = isBottomSideVisible ? FULL_HEADER_HEIGHT : SHORT_HEADER_HEIGHT;

    document.documentElement.style.setProperty('--header-height', currentHeight);
  }, [isBottomSideVisible]);

  return (
    <header className={styles.header}>
      <TopSide />

      <CSSTransitionWithRef
        in={isBottomSideVisible}
        exit={withBottomSide}
        timeout={AnimationTimeout.Small}
        mountOnEnter
        unmountOnExit>
        <BottomSide />
      </CSSTransitionWithRef>
    </header>
  );
};

export { Header };
