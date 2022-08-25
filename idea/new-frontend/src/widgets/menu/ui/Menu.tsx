import { useState } from 'react';
import clsx from 'clsx';
import { useApi } from '@gear-js/react-hooks';

import styles from './Menu.module.scss';
import { Logo } from './logo';
import { Navigation } from './navigation';
import { NodesButton } from './nodesButton';

const Menu = () => {
  const { api, isApiReady } = useApi();

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prevState) => !prevState);

  const chain = api?.runtimeChain.toHuman();
  const specName = api?.runtimeVersion.specName.toHuman();
  const specVersion = api?.runtimeVersion.specVersion.toHuman();

  return (
    <menu className={styles.menu}>
      <div className={clsx(styles.menuContent, isOpen && styles.open)}>
        <Logo isOpen={isOpen} />
        <Navigation isOpen={isOpen} />
        <NodesButton chain={chain} name={specName} version={specVersion} isOpen={isOpen} isApiReady={isApiReady} />
      </div>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className={styles.menuBtn} onClick={toggleMenu} />
    </menu>
  );
};

export { Menu };
