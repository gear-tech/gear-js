import { useApi } from 'hooks';
import OnLogin from 'components/on-login';
import Logo from './logo';
import Account from './account';
import styles from './Header.module.scss';
import Menu from './menu';

function Header() {
  const { isApiReady } = useApi();

  return (
    <header className={styles.header}>
      <Logo />
      <OnLogin>
        <Menu />
      </OnLogin>
      {isApiReady && <Account />}
    </header>
  );
}

export default Header;
