import { useApi, useAccount } from 'hooks';
import { Logo } from './logo';
import { Menu } from './menu';
import { Account } from './account';
import styles from './Header.module.scss';

function Header() {
  const { isApiReady } = useApi();
  const { account } = useAccount();

  return (
    <header className={styles.header}>
      <Logo />
      {account && <Menu />}
      {isApiReady && <Account />}
    </header>
  );
}

export { Header };
