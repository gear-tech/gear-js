import { useAccount } from 'hooks';
import Logo from './logo';
import Menu from './menu';
import AccountSwitch from './account-switch';
import styles from './Header.module.scss';

function Header() {
  const { account } = useAccount();

  return (
    <header className={styles.header}>
      <Logo />
      {account && <Menu />}
      <AccountSwitch />
    </header>
  );
}

export default Header;
