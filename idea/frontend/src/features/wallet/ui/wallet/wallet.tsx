import { useAccount } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';
import cx from 'clsx';
import { useState } from 'react';

import { OnboardingTooltip } from '@/shared/ui/onboardingTooltip';
import SubstrateSVG from '@/shared/assets/images/logos/substrate.svg?react';

import { AccountsModal } from '../accounts-modal';
import { AccountButton } from '../account-button';
import { Balance } from '../balance';
import styles from './wallet.module.scss';
import { useNewAccount } from '@/app/providers/account';

const Wallet = () => {
  const isAccountReady = true;
  const { account } = useNewAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={styles.wallet}>
        <Balance />

        {isAccountReady &&
          (account ? (
            <AccountButton
              name={account.meta.name}
              address={account.address}
              className={cx(buttonStyles.medium, styles.accountBtn)}
              onClick={openModal}
            />
          ) : (
            <OnboardingTooltip className={styles.onboardingTooltip} index={0}>
              <Button icon={SubstrateSVG} text="Connect" color="primary" onClick={openModal} />
            </OnboardingTooltip>
          ))}
      </div>

      {isModalOpen && <AccountsModal close={closeModal} />}
    </>
  );
};

export { Wallet };
