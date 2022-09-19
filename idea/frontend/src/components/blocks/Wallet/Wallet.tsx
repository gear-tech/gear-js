import clsx from 'clsx';
import Identicon from '@polkadot/react-identicon';
import { useAccount } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';

import styles from './Wallet.module.scss';

import { useModal } from 'hooks';

const Wallet = () => {
  const { account, accounts } = useAccount();
  const { showModal } = useModal();

  const openModal = () => showModal('accounts', { accounts });

  const balanceSectionClassName = clsx(styles.section, styles.balance);
  const accButtonClassName = clsx(
    buttonStyles.button,
    buttonStyles.normal,
    buttonStyles.secondary,
    styles.accountButton
  );

  return (
    <div className={styles.wallet}>
      {account ? (
        <>
          <div className={balanceSectionClassName}>
            <p>
              Balance:{' '}
              <span className={styles.balanceAmount}>
                {account.balance.value} {account.balance.unit}
              </span>
            </p>
          </div>
          <div className={styles.section}>
            <button type="button" className={accButtonClassName} onClick={openModal}>
              <Identicon value={account.address} size={28} theme="polkadot" className={styles.avatar} />
              {account.meta.name}
            </button>
          </div>
        </>
      ) : (
        <div>
          <Button text="Connect" color="secondary" className={styles.accountButton} onClick={openModal} />
        </div>
      )}
    </div>
  );
};

export { Wallet };
