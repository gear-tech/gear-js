import { useAccount } from '@gear-js/react-hooks';

import { WALLETS, WALLET, WalletId } from '../../model';
import { Wallet } from '../wallet';
import styles from './Wallets.module.scss';

type Props = {
  selectedWalletId: WalletId | undefined;
  onWalletClick: (id: WalletId) => void;
};

const Wallets = ({ selectedWalletId, onWalletClick }: Props) => {
  const { extensions } = useAccount();

  const getWallets = () =>
    WALLETS.map((id) => {
      const walletId = id as WalletId;
      const { name, icon } = WALLET[walletId];

      const isConnected = !!extensions?.some(({ name }) => name === id);

      return (
        <li key={id}>
          <Wallet
            name={name}
            icon={icon}
            isConnected={isConnected}
            isActive={selectedWalletId === walletId}
            onClick={() => onWalletClick(walletId)}
          />
        </li>
      );
    });

  return <ul className={styles.wallets}>{getWallets()}</ul>;
};

export { Wallets };
