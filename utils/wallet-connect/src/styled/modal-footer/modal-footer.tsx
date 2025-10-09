import { Button } from '@gear-js/vara-ui';

import EditSVG from '@/assets/edit-icon.svg?react';
import ExitSVG from '@/assets/exit.svg?react';
import { Wallet } from '@/headless';
import { cx } from '@/utils';

import styles from './modal-footer.module.scss';

// TODO: no need to render footer on wallets list
// should cases like that be handled with props or context?
// should we determine conditional render in our headless components?
// if not, then how it should be done?
function ModalFooter() {
  return (
    <div className={styles.footer}>
      <Wallet.ChangeWalletTrigger render={<Button text="" color="transparent" />}>
        <span className={styles.wallet}>
          <Wallet.ChangeWalletIcon className={styles.walletIcon} />
          <Wallet.ChangeWalletName />
        </span>

        <EditSVG className={cx(styles.editIcon, styles.vara)} />
      </Wallet.ChangeWalletTrigger>

      <Wallet.LogoutTrigger
        render={<Button size="medium" icon={ExitSVG} color="transparent" />}
        className={cx(styles.logoutButton, styles.vara)}
      />
    </div>
  );
}

export { ModalFooter };
