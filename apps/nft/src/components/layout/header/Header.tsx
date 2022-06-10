import { useAccount, useApi } from '@gear-js/react-hooks';
import { Logo } from './logo';
import { CreateLink } from './create-link';
import { Account } from './account';
import styles from './Header.module.scss';

function Header() {
  const { isApiReady } = useApi();
  const { account } = useAccount();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Logo />
        {account && <CreateLink />}
      </nav>
      {isApiReady && <Account />}
    </header>
  );
}

export { Header };
