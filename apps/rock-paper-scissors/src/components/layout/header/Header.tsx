import { Logo } from './logo';
import { AccountComponent } from './account';
import styles from './Header.module.scss';

type Props = {
  isAccountVisible: boolean;
};

function Header({ isAccountVisible }: Props) {
  return (
    <header className={styles.header}>
      <Logo />
      {isAccountVisible && <AccountComponent />}
    </header>
  );
}

export { Header };
