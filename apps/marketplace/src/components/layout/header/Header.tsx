import { OnLogin } from 'components';
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
        <OnLogin>
          <Menu />
        </OnLogin>
      </nav>
      {isAccountVisible && <Account />}
    </header>
  );
}

export { Header };
