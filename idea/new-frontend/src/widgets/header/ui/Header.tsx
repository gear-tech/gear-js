import { useAccount } from '@gear-js/react-hooks';

import styles from './Header.module.scss';
import { TopSide } from './topSide';
import { BottomSide } from './bottomSide';

const Header = () => {
  const { account } = useAccount();

  return (
    <header className={styles.header}>
      <TopSide account={account} />
      {account && <BottomSide />}
    </header>
  );
};

export { Header };
