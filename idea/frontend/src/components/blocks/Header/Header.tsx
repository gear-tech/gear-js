import { useState, useEffect } from 'react';

import styles from './Header.module.scss';
import { Wallet } from '../Wallet/Wallet';
import { useApi, useAccount } from '@gear-js/react-hooks';

import { Logo } from './children/Logo/Logo';
import { Menu } from './children/Menu/Menu';
import { Sidebar } from './children/Sidebar/Sidebar';
import { TestBalance } from './children/TestBalance';

import { useSidebarNodes } from 'hooks';

const Header = () => {
  const { account } = useAccount();
  const { api, isApiReady } = useApi();
  const sidebarNodes = useSidebarNodes();

  const [nodeVersion, setNodeVersion] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const chain = api?.runtimeChain.toHuman();
  const specName = api?.runtimeVersion.specName.toHuman();
  const specVersion = api?.runtimeVersion.specVersion.toHuman();

  useEffect(() => {
    if (api) {
      api.nodeVersion().then((result) => {
        const version = result.split('-')[1];

        if (version && version !== 'unknown') {
          setNodeVersion(version);
        }
      });
    }
  }, [api]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Logo />
        <hr className={styles.separator} />
        <Menu
          chain={chain}
          name={specName}
          version={specVersion}
          isApiReady={isApiReady}
          nodeVersion={nodeVersion}
          openSidebar={openSidebar}
        />
      </nav>
      <div className={styles.rightSide}>
        {account && <TestBalance address={account.address} />}
        <Wallet />
      </div>
      {isSidebarOpen && <Sidebar closeSidebar={closeSidebar} nodeSections={sidebarNodes} />}
    </header>
  );
};

export { Header };
