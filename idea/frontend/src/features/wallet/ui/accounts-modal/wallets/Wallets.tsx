import { useAccount } from '@gear-js/react-hooks';

import { Wallet } from '../wallet';
import styles from './Wallets.module.scss';
import { WALLETS, WALLET } from '../../../consts';
import { WalletId } from '../../../types';

type Props = {
  selectedWalletId: WalletId | null;
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
