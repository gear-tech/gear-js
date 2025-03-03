import { useAccount } from 'wagmi';

import logo from '@/assets/logo.svg';
import { HeaderBalance } from '@/components';
import { NodesSwitch } from '@/features/nodes-switch';

import { WalletButton } from '../wallet/wallet-button';

import styles from './header.module.scss';

const Header = () => {
  const ethAccount = useAccount();
  const isConnected = Boolean(ethAccount.chainId);

  return (
    <header className={styles.container}>
      <div className={styles.leftGroup}>
        <img src={logo} alt="Gear logo" />
        <NodesSwitch />
      </div>

      <div className={styles.rightGroup}>
        {isConnected && <HeaderBalance />}
        <WalletButton />
      </div>
    </header>
  );
};

export { Header };
