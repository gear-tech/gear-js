import { useApi } from 'hooks';
import { Logo } from './logo';
import { Account } from './account';
import styles from './Header.module.scss';

function Header() {
  const { isApiReady } = useApi();

  return (
    <header className={styles.header}>
      <Logo />
      {isApiReady && <Account />}
    </header>
  );
}

export { Header };
