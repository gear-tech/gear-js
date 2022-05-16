import Logo from './logo';
import Account from './account';
import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <Logo />
      <Account />
    </header>
  );
}

export default Header;
