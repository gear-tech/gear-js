import { memo } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import clsx from 'clsx';
import { decodeAddress } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';

import { copyToClipboard } from '@/shared/helpers';
import { AccountButton } from '@/shared/ui/accountButton';
import copyKeySVG from '@/shared/assets/images/actions/copyKey.svg?react';

import styles from './AccountItem.module.scss';

type Props = {
  account: InjectedAccountWithMeta;
  isActive: boolean;
  onClick: (account: InjectedAccountWithMeta) => void;
};

const AccountItem = memo(({ account, isActive, onClick }: Props) => {
  const alert = useAlert();

  const handleClick = () => {
    if (isActive) {
      return;
    }

    onClick(account);
  };

  const handleCopy = () => {
    const decodedAddress = decodeAddress(account.address);

    copyToClipboard(decodedAddress, alert);
  };

  const accountBtnClasses = clsx(
    buttonStyles.large,
    styles.accountButton,
    isActive ? styles.active : buttonStyles.light,
  );

  return (
    <li className={styles.accountItem}>
      <AccountButton
        name={account.meta.name}
        address={account.address}
        className={accountBtnClasses}
        onClick={handleClick}
      />
      <Button icon={copyKeySVG} color="transparent" onClick={handleCopy} />
    </li>
  );
});

export { AccountItem };
