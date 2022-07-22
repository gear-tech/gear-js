import { useState } from 'react';

import styles from './Header.module.scss';
import { Wallet } from '../Wallet/Wallet';
import { useAccount } from '@gear-js/react-hooks';

import { Logo } from './children/Logo/Logo';
import { Menu } from './children/Menu/Menu';
import { Sidebar } from './children/Sidebar/Sidebar';
import { TestBalance } from './children/TestBalance';

import { useSidebarNodes } from 'hooks';

const Header = () => {
  const { account } = useAccount();
  const sidebarNodes = useSidebarNodes();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Logo />
        <hr className={styles.separator} />
        <Menu openSidebar={openSidebar} />
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
