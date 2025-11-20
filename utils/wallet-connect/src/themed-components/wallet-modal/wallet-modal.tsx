import { Wallet } from '@/components';
import { cx } from '@/utils';

import { AccountList } from '../account-list';
import { UI_CONFIG } from '../consts';
import { ModalFooter } from '../modal-footer';
import { ThemeProps } from '../types';
import { WalletList } from '../wallet-list';

import styles from './wallet-modal.module.scss';

function WalletModal({ theme }: ThemeProps) {
  const { Dialog } = UI_CONFIG[theme];

  return (
    <Wallet.Root render={<></>}>
      <Wallet.Dialog
        render={(props, state) => (
          <Dialog footer={state.isWalletSelected && <ModalFooter theme={theme} />} {...props} {...state} />
        )}>
        <WalletList theme={theme} />
        <AccountList theme={theme} />

        <Wallet.NoWallets className={cx(styles.text, styles[theme])} />
        <Wallet.NoMobileWallets className={cx(styles.text, styles[theme])} />
        <Wallet.NoAccounts className={cx(styles.text, styles[theme])} />
      </Wallet.Dialog>
    </Wallet.Root>
  );
}

export { WalletModal };
