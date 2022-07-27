import { useApi } from '@gear-js/react-hooks';
import { Logo } from './logo';
import { Menu } from './menu';
import { Account } from './account';
import styles from './Header.module.scss';

function Header() {
  const { isApiReady } = useApi();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Logo />
        <Menu />
      </nav>
      {isApiReady && <Account />}
    </header>
  );
}

export { Header };
