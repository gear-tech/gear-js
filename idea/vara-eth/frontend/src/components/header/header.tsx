import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

import logo from '@/assets/logo.svg';
import { HeaderBalance } from '@/components';
import { routes } from '@/shared/config';

import { WalletButton } from '../wallet/wallet-button';

import styles from './header.module.scss';

const Header = () => {
  const ethAccount = useAccount();
  const isConnected = Boolean(ethAccount.chainId);

  return (
    <header className={styles.container}>
      <div className={styles.leftGroup}>
        <Link to={routes.home} className={styles.logo}>
          <img src={logo} alt="Gear logo" />
        </Link>

        {/* <NodesSwitch /> */}
      </div>

      <div className={styles.rightGroup}>
        {isConnected && <HeaderBalance />}
        <WalletButton />
      </div>
    </header>
  );
};

export { Header };
