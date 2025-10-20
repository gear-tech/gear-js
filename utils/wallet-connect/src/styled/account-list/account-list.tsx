import { Button } from '@gear-js/vara-ui';

import CopySVG from '@/assets/copy.svg?react';
import { Wallet } from '@/headless';
import { cx } from '@/utils';

import styles from './account-list.module.scss';

function AccountList() {
  return (
    <Wallet.AccountsList className={styles.list}>
      <Wallet.AccountItem className={styles.account}>
        {/* TODO: if active - primary color. props or context? */}
        <Wallet.AccountTrigger render={<Button text="" color="plain" size="small" block />}>
          <Wallet.AccountIcon theme="polkadot" size={16} />
          <Wallet.AccountLabel />
        </Wallet.AccountTrigger>

        <Wallet.CopyAccountAddressTrigger
          // eslint-disable-next-line react/no-children-prop
          render={<Button children={undefined} icon={CopySVG} size="medium" color="transparent" />}
          className={cx(styles.copyButton, styles.vara)}
        />
      </Wallet.AccountItem>
    </Wallet.AccountsList>
  );
}

export { AccountList };
