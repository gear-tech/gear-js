import { Logo } from './logo';
import { Account } from './account';
import styles from './Header.module.scss';

type Props = {
  isAccountVisible: boolean;
};

function Header({ isAccountVisible }: Props) {
  return (
    <header className={styles.header}>
      <Logo />
      {isAccountVisible && <Account />}
    </header>
  );
}

export { Header };
