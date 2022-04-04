import { Button } from '@gear-js/ui';
import icon from './login.svg';
import Logo from './logo';
import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <Logo />
      <Button icon={icon} text="Sign in" />
    </header>
  );
}

export default Header;
