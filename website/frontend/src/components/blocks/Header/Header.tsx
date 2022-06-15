import { useState } from 'react';
import { Wallet } from '../Wallet/Wallet';
import { Logo } from './children/Logo/Logo';
import { Menu } from './children/Menu/Menu';
import { Sidebar } from './children/Sidebar/Sidebar';
import { useSidebarNodes } from './hooks';
import styles from './Header.module.scss';

const Header = () => {
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
        <Menu openSidebar={openSidebar} />
      </nav>
      <Wallet />
      {isSidebarOpen && <Sidebar closeSidebar={closeSidebar} nodeSections={sidebarNodes} />}
    </header>
  );
};

export { Header };
