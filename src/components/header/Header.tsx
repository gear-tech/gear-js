import Logo from './logo';
import AccountSwitch from './account-switch';
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
