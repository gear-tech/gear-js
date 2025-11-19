import { buttonStyles, Button as GearButton } from '@gear-js/ui';
import { Button as VaraButton } from '@gear-js/vara-ui';

import CopySVG from '@/assets/copy.svg?react';
import { Wallet } from '@/headless';
import { cx } from '@/utils';

import { GearButton as GearAccountButton } from '../gear-button';
import { HTMLProps, ThemeProps } from '../types';

import styles from './account-list.module.scss';

function AccountList({ theme }: ThemeProps) {
  const isVara = theme === 'vara';

  const renderAccountTrigger = (
    { color: _color, children, ...props }: HTMLProps,
    { isActive }: { isActive: boolean },
  ) => {
    if (isVara) {
      return (
        <VaraButton color={isActive ? 'primary' : 'plain'} size="small" block {...props}>
          {children}
        </VaraButton>
      );
    }

    return (
      <GearAccountButton color={isActive ? 'primary' : 'light'} size="large" block {...props}>
        {children}
      </GearAccountButton>
    );
  };

  const renderCopyTrigger = () =>
    isVara ? (
      // eslint-disable-next-line react/no-children-prop
      <VaraButton children={undefined} icon={CopySVG} size="medium" color="transparent" />
    ) : (
      <GearButton icon={CopySVG} color="transparent" />
    );

  return (
    <Wallet.AccountsList className={styles.list}>
      <Wallet.AccountItem className={styles.account}>
        <Wallet.AccountTrigger render={renderAccountTrigger}>
          <Wallet.AccountIcon
            theme="polkadot"
            size={16}
            className={!isVara ? cx(buttonStyles.icon, styles.accountIcon) : undefined}
          />

          <Wallet.AccountLabel />
        </Wallet.AccountTrigger>

        <Wallet.CopyAccountAddressTrigger
          render={renderCopyTrigger()}
          className={cx(styles.copyButton, styles[theme])}
        />
      </Wallet.AccountItem>
    </Wallet.AccountsList>
  );
}

export { AccountList };
