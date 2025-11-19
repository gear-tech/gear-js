import { Button as GearButton } from '@gear-js/ui';
import { Button as VaraButton } from '@gear-js/vara-ui';

import EditSVG from '@/assets/edit-icon.svg?react';
import ExitSVG from '@/assets/exit.svg?react';
import { Wallet } from '@/headless';
import { cx } from '@/utils';

import { GearButton as GearWalletButton } from '../gear-button';
import { ThemeProps } from '../types';

import styles from './modal-footer.module.scss';

function ModalFooter({ theme }: ThemeProps) {
  const renderChangeWalletTrigger = () =>
    theme === 'vara' ? <VaraButton text="" color="transparent" /> : <GearWalletButton color="transparent" />;

  const renderLogoutTrigger = () =>
    theme === 'vara' ? (
      <VaraButton size="medium" icon={ExitSVG} color="transparent" />
    ) : (
      <GearButton text="Logout" icon={ExitSVG} color="transparent" />
    );

  return (
    <div className={styles.footer}>
      <Wallet.ChangeWalletTrigger render={renderChangeWalletTrigger()}>
        <span className={styles.wallet}>
          <Wallet.ChangeWalletIcon className={styles.walletIcon} />
          <Wallet.ChangeWalletName />
        </span>

        <EditSVG className={cx(styles.editIcon, styles[theme])} />
      </Wallet.ChangeWalletTrigger>

      <Wallet.LogoutTrigger render={renderLogoutTrigger()} className={cx(styles.logoutButton, styles[theme])} />
    </div>
  );
}

export { ModalFooter };
