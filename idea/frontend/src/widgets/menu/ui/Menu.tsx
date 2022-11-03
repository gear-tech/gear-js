import { useState } from 'react';
import clsx from 'clsx';

import { NodesSwitch } from 'features/nodesSwitch';
import { ReactComponent as MenuButtonSVG } from 'shared/assets/images/menu/menuButton.svg';

import styles from './Menu.module.scss';
import { Logo } from './logo';
import { Navigation } from './navigation';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleMenu = () => setIsOpen((prevState) => !prevState);

  return (
    <menu className={clsx('menu', styles.menu)}>
      <div className={clsx(styles.wrapper, isOpen && styles.open)}>
        <div className={clsx(styles.menuContent, isOpen && styles.open)}>
          <Logo isOpen={isOpen} />
          <Navigation isOpen={isOpen} />
        </div>
        <NodesSwitch isButtonFullWidth={isOpen} />
      </div>

      <button type="button" className={clsx(styles.menuBtn, !isOpen && styles.rotated)} onClick={toggleMenu}>
        <MenuButtonSVG />
      </button>
    </menu>
  );
};

export { Menu };
