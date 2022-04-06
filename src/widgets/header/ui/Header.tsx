import AccountSwitch from 'features/account-switch';
import Logo from './logo';
import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <Logo />
      <AccountSwitch />
    </header>
  );
}

export default Header;
