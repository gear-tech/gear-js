import { useAccount } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';
import cx from 'clsx';

import { useModalState } from '@/hooks';
import { OnboardingTooltip } from '@/shared/ui/onboardingTooltip';
import SubstrateSVG from '@/shared/assets/images/logos/substrate.svg?react';

import { AccountsModal } from '../accounts-modal';
import { AccountButton } from '../account-button';
import styles from './wallet.module.scss';

const Wallet = () => {
  const { account, isAccountReady } = useAccount();
  const [isModalOpen, openModal, closeModal] = useModalState();

  if (!isAccountReady) return null;

  return (
    <>
      {account ? (
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
      )}

      {isModalOpen && <AccountsModal close={closeModal} />}
    </>
  );
};

export { Wallet };
