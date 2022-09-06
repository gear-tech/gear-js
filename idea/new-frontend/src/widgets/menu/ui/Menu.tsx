import { useState, MouseEvent } from 'react';
import clsx from 'clsx';
import { useApi } from '@gear-js/react-hooks';

import { useNodes } from 'hooks';
import { NodesPopup } from 'features/nodesPopup';

import styles from './Menu.module.scss';
import { Logo } from './logo';
import { Navigation } from './navigation';
import { NodesButton } from './nodesButton';

const Menu = () => {
  const nodeSections = useNodes();
  const { api, isApiReady } = useApi();

  const [isOpen, setIsOpen] = useState(false);
  const [isNodesOpen, setIsNodesOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prevState) => !prevState);
  const toggleNodesPopup = (event?: MouseEvent) => {
    event?.stopPropagation();

    setIsNodesOpen((prevState) => !prevState);
  };

  const chain = api?.runtimeChain.toHuman();
  const specName = api?.runtimeVersion.specName.toHuman();
  const specVersion = api?.runtimeVersion.specVersion.toHuman();

  return (
    <menu className={styles.menu}>
      <div className={clsx(styles.menuContent, isOpen && styles.open)}>
        <Logo isOpen={isOpen} />
        <Navigation isOpen={isOpen} />
        <NodesButton
          name={specName}
          chain={chain}
          version={specVersion}
          isApiReady={isApiReady}
          isFullWidth={isOpen}
          onClick={toggleNodesPopup}
        />
      </div>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className={styles.menuBtn} onClick={toggleMenu} />
      <NodesPopup chain={chain} nodeSections={nodeSections} isOpen={isNodesOpen} onClose={toggleNodesPopup} />
    </menu>
  );
};

export { Menu };
