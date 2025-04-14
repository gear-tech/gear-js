import * as Gear from '@gear-js/ui';
import cx from 'clsx';

import { Wallet, WalletButtonProps, WalletProps } from './wallet-button';
import styles from './wallet-button.module.scss';

function GearWalletButton({ children, SVG, name, ...props }: WalletButtonProps & WalletProps) {
  return (
    <button
      type="button"
      className={cx(
        Gear.buttonStyles.button,
        Gear.buttonStyles.large,
        Gear.buttonStyles.light,
        Gear.buttonStyles.block,
        styles.button,
      )}
      {...props}>
      <Wallet SVG={SVG} name={name} />
      {children}
    </button>
  );
}

function GearWalletButtonChange({ SVG, name, children, ...props }: Omit<WalletButtonProps, 'disabled'> & WalletProps) {
  return (
    <button type="button" className={cx(Gear.buttonStyles.button, Gear.buttonStyles.transparent)} {...props}>
      <Wallet SVG={SVG} name={name} />
      {children}
    </button>
  );
}

GearWalletButton.Change = GearWalletButtonChange;

export { GearWalletButton };
