import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';

import { Balance } from '../balance';
import { useUiKit } from '../use-ui-kit';
import { WalletModal } from '../wallet-modal';

import styles from './wallet.module.scss';

type Props = {
  theme?: 'gear' | 'vara';
  displayBalance?: boolean;

  // temp solution to support responsiveness in dApps MenuHandler, until it's supported here
  accountButtonClassName?: string;
};

function Wallet({ theme = 'vara', displayBalance = true, accountButtonClassName }: Props) {
  const { account, isAccountReady } = useAccount();
  const { components, isLoading } = useUiKit(theme);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!isAccountReady || isLoading || !components) return null;

  const { Button, AccountButton } = components;

  return (
    <>
      <div className={styles.wallet}>
        {displayBalance && <Balance theme={theme} />}

        {account ? (
          <div className={accountButtonClassName}>
            <AccountButton address={account.address} name={account.meta.name} onClick={openModal} />
          </div>
        ) : (
          <Button text="Connect Wallet" color="primary" onClick={openModal} />
        )}
      </div>

      {isModalOpen && <WalletModal theme={theme} close={closeModal} />}
    </>
  );
}

export { Wallet };
