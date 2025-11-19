import { useAlert } from '@gear-js/react-hooks';
import { buttonStyles } from '@gear-js/ui';

import { Wallet } from '@/components';
import { cx } from '@/utils';

import { UI_CONFIG } from '../consts';
import { ThemeProps } from '../types';

import styles from './account-list.module.scss';

function AccountList({ theme }: ThemeProps) {
  const { AccountTrigger, CopyAccountAddressTrigger } = UI_CONFIG[theme];

  const alert = useAlert();

  return (
    <Wallet.AccountsList className={styles.list}>
      <Wallet.AccountItem className={styles.account}>
        <Wallet.AccountTrigger render={AccountTrigger}>
          <Wallet.AccountIcon
            theme="polkadot"
            size={16}
            className={theme === 'gear' ? cx(buttonStyles.icon, styles.accountIcon) : undefined}
          />

          <Wallet.AccountLabel />
        </Wallet.AccountTrigger>

        <Wallet.CopyAccountAddressTrigger
          render={CopyAccountAddressTrigger}
          onCopy={() => alert.success('Copied')}
          className={cx(styles.copyButton, styles[theme])}
        />
      </Wallet.AccountItem>
    </Wallet.AccountsList>
  );
}

export { AccountList };
