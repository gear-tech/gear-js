import { Tooltip } from '@gear-js/ui';
import clsx from 'clsx';
import { useState } from 'react';

import { NodesSwitch } from '@/features/nodesSwitch';
import { useNodeVersion } from '@/hooks';
import GithubLogoSVG from '@/shared/assets/images/menu/github.svg?react';
import MenuButtonSVG from '@/shared/assets/images/menu/menuButton.svg?react';
import { AnimationTimeout } from '@/shared/config';
import { CSSTransitionWithRef } from '@/shared/ui';

import styles from './Menu.module.scss';
import { Logo } from './logo';
import { Navigation } from './navigation';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleMenu = () => setIsOpen((prevState) => !prevState);

  const { nodeVersion, commitHash } = useNodeVersion();

  return (
    <menu className={clsx('menu', styles.menu)}>
      <div className={clsx(styles.wrapper, isOpen && styles.open)}>
        <div className={styles.menuContent}>
          <Logo isOpen={isOpen} />
          <Navigation isOpen={isOpen} />
          <div className={clsx(styles.gradient, isOpen && styles.open)} />
        </div>

        {nodeVersion && (
          <div className={styles.version}>
            <a
              rel="external noreferrer"
              href={`https://github.com/gear-tech/gear/commit/${commitHash}`}
              target="_blank"
              className={styles.versionLink}>
              <GithubLogoSVG />

              <CSSTransitionWithRef in={isOpen} timeout={AnimationTimeout.Tiny} unmountOnExit mountOnEnter>
                <span className={styles.text}>{nodeVersion}</span>
              </CSSTransitionWithRef>
            </a>

            <Tooltip text="Node version" className={styles.tooltip} />
          </div>
        )}

        <NodesSwitch isButtonFullWidth={isOpen} />
      </div>

      <button type="button" className={clsx(styles.menuBtn, !isOpen && styles.rotated)} onClick={toggleMenu}>
        <MenuButtonSVG />
      </button>
    </menu>
  );
};

export { Menu };
