import { useApi } from '@gear-js/react-hooks';
import { Logo } from './logo';
import { Menu } from './menu';
import { Account } from './account';
import styles from './Header.module.scss';

type Props = {
  isAccountVisible: boolean;
};

function Header({ isAccountVisible }: Props) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Logo />
        <Menu />
      </nav>
      {isAccountVisible && <Account />}
    </header>
  );
}

export { Header };
