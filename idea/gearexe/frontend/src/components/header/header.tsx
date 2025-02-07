import { useAccount } from 'wagmi';
import { WalletButton } from '../wallet/wallet-button';
import { HeaderBalance } from '@/components';
import { NodesSwitch } from '@/features/nodesSwitch';
import logo from '@/assets/logo.svg';
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
