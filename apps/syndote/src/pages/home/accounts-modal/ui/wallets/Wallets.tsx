import type { InjectedExtension } from '@polkadot/extension-inject/types';

import { WALLETS, WALLET, WalletId } from '../../model';
import { Wallet } from '../wallet';
import styles from './Wallets.module.scss';

type Props = {
  selectedWalletId: WalletId | undefined;
  extensions: InjectedExtension[];
  onWalletClick: (id: WalletId) => void;
};

function Wallets({ selectedWalletId, extensions, onWalletClick }: Props) {
  const isWalletConnected = (id: string) => extensions.some(({ name }) => name === id);

  const getWallets = () =>
    WALLETS.map((id) => {
      const walletId = id as WalletId;
      const { name, icon } = WALLET[walletId];

      return (
        <li key={id}>
          <Wallet
            name={name}
            icon={icon}
            isConnected={isWalletConnected(id)}
            isActive={selectedWalletId === walletId}
            onClick={() => onWalletClick(walletId)}
          />
        </li>
      );
    });

  return <ul className={styles.wallets}>{getWallets()}</ul>;
}

export { Wallets };
