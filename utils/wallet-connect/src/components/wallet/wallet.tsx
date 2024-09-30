import { useAccount, useApi, useBalanceFormat, useDeriveBalancesAll } from '@gear-js/react-hooks';
import cx from 'clsx';
import { useState } from 'react';

import { ReactComponent as VaraSVG } from '../../assets/vara.svg';
import { WalletModal } from '../wallet-modal';
import { UI_CONFIG } from '../ui-config';
import styles from './wallet.module.css';

type Props = {
  variant?: 'gear' | 'vara';
  // temp solution to support responsiveness in MenuHandler, until it's supported here
  accountButtonClassName?: string;
};

function Wallet({ variant = 'vara', accountButtonClassName }: Props) {
  const { isApiReady } = useApi();
  const { account, isAccountReady } = useAccount();

  const { getFormattedBalance } = useBalanceFormat();
  const { data: balances } = useDeriveBalancesAll({ address: account?.decodedAddress, watch: true });
  const balance = isApiReady && balances ? getFormattedBalance(balances.freeBalance) : undefined;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!isAccountReady) return null;
  const { Button, AccountButton } = UI_CONFIG[variant];

  return (
    <>
      <div className={styles.wallet}>
        {balance && (
          <div className={styles.balance}>
            <VaraSVG />

            <p className={cx(styles.text, styles[variant])}>
              <span className={styles.value}>{balance.value}</span>
              <span className={styles.unit}>{balance.unit}</span>
            </p>
          </div>
        )}

        {account ? (
          <div className={accountButtonClassName}>
            <AccountButton address={account.address} name={account.meta.name} onClick={openModal} />
          </div>
        ) : (
          <Button text="Connect Wallet" color="primary" onClick={openModal} />
        )}
      </div>

      {isModalOpen && <WalletModal variant={variant} close={closeModal} />}
    </>
  );
}

export { Wallet };
