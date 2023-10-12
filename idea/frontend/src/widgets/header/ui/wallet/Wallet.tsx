import cx from 'clsx';
import { useAccount } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';

import { useModal } from '@/hooks';
import { AccountButton } from '@/shared/ui/accountButton';
import { OnboardingTooltip } from '@/shared/ui/onboardingTooltip';
import substrateSVG from '@/shared/assets/images/logos/substrate.svg?react';

import { Balance } from '../balance';
import styles from './Wallet.module.scss';

const Wallet = () => {
  const { account, isAccountReady } = useAccount();

  const { showModal } = useModal();
  const openAccountsModal = () => showModal('accounts');

  return isAccountReady ? (
    account ? (
      <div className={styles.wallet}>
        <Balance />

        <AccountButton
          name={account.meta.name}
          address={account.address}
          className={cx(buttonStyles.medium, styles.accountBtn)}
          onClick={openAccountsModal}
        />
      </div>
    ) : (
      <OnboardingTooltip className={styles.onboardingTooltip} index={0}>
        <Button icon={substrateSVG} text="Connect" color="primary" onClick={openAccountsModal} />
      </OnboardingTooltip>
    )
  ) : null;
};

export { Wallet };
