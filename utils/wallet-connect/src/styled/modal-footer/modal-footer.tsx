import EditSVG from '@/assets/edit-icon.svg?react';
import { Wallet } from '@/headless';
import { cx } from '@/utils';

import { UI_CONFIG } from '../consts';
import { ThemeProps } from '../types';

import styles from './modal-footer.module.scss';

function ModalFooter({ theme }: ThemeProps) {
  const { ChangeWalletTrigger, LogoutTrigger } = UI_CONFIG[theme];

  return (
    <div className={styles.footer}>
      <Wallet.ChangeWalletTrigger render={ChangeWalletTrigger}>
        <span className={styles.wallet}>
          <Wallet.ChangeWalletIcon className={styles.walletIcon} />
          <Wallet.ChangeWalletName />
        </span>

        <EditSVG className={cx(styles.editIcon, styles[theme])} />
      </Wallet.ChangeWalletTrigger>

      <Wallet.LogoutTrigger render={LogoutTrigger} className={cx(styles.logoutButton, styles[theme])} />
    </div>
  );
}

export { ModalFooter };
