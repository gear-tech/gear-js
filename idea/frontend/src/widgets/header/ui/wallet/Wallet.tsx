import clsx from 'clsx';
import { Account, useAccount } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';

import { useModal } from '@/hooks';
import { AccountButton } from '@/shared/ui/accountButton';
import substrateSVG from '@/shared/assets/images/logos/substrate.svg?react';

import { OnboardingTooltip } from '@/shared/ui/onboardingTooltip';
import styles from './Wallet.module.scss';

type Props = {
  account?: Account;
};

const Wallet = ({ account }: Props) => {
  const { accounts } = useAccount();
  const { showModal } = useModal();

  const openAccountsModal = () => showModal('accounts', { accounts });

  const accountBtnClasses = clsx(buttonStyles.medium, styles.accountBtn);

  return (
    <OnboardingTooltip className={styles.walletWrapper} index={0}>
      {account ? (
        <AccountButton
          name={account.meta.name}
          address={account.address}
          className={accountBtnClasses}
          onClick={openAccountsModal}
        />
      ) : (
        <Button icon={substrateSVG} text="Connect" color="primary" onClick={openAccountsModal} />
      )}
    </OnboardingTooltip>
  );
};

export { Wallet };
