import { Tooltip } from '@gear-js/ui';
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';

import { NodesSwitch } from 'features/nodesSwitch';
import { ReactComponent as MenuButtonSVG } from 'shared/assets/images/menu/menuButton.svg';
import { ReactComponent as GithubLogoSVG } from 'shared/assets/images/menu/github.svg';
import { AnimationTimeout } from 'shared/config';
import { useNodeVersion } from 'hooks';

import styles from './Menu.module.scss';
import { Logo } from './logo';
import { Navigation } from './navigation';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleMenu = () => setIsOpen((prevState) => !prevState);

  const nodeVersion = useNodeVersion();

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
              href={`https://github.com/gear-tech/gear/commit/${nodeVersion}`}
              target="_blank"
              className={styles.versionLink}>
              <GithubLogoSVG />

              <CSSTransition in={isOpen} timeout={AnimationTimeout.Tiny} unmountOnExit mountOnEnter>
                <span className={styles.text}>{nodeVersion}</span>
              </CSSTransition>
            </a>

            <CSSTransition in={isOpen} timeout={AnimationTimeout.Tiny} unmountOnExit mountOnEnter>
              <Tooltip text="Node version" className={styles.tooltip} />
            </CSSTransition>
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
