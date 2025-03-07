import * as Gear from '@gear-js/ui';
import * as Vara from '@gear-js/vara-ui';
import cx from 'clsx';
import { FunctionComponent, ReactNode, SVGProps } from 'react';

import styles from './wallet-button.module.scss';

type Props = {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
};

type WalletProps = {
  SVG: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  name: string;
};

function Wallet({ SVG, name }: WalletProps) {
  return (
    <span className={styles.wallet}>
      <SVG className={styles.icon} />
      {name}
    </span>
  );
}

function VaraWalletButton({ children, SVG, name, ...props }: Props & WalletProps) {
  return (
    <Vara.Button className={styles.button} color="plain" size="small" block {...props}>
      <Wallet SVG={SVG} name={name} />
      {children}
    </Vara.Button>
  );
}

function GearWalletButton({ children, SVG, name, ...props }: Props & WalletProps) {
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

function VaraWalletButtonChange({ SVG, name, children, ...props }: Omit<Props, 'disabled'> & WalletProps) {
  return (
    <Vara.Button color="transparent" {...props}>
      <Wallet SVG={SVG} name={name} />
      {children}
    </Vara.Button>
  );
}

function GearWalletButtonChange({ SVG, name, children, ...props }: Omit<Props, 'disabled'> & WalletProps) {
  return (
    <button type="button" className={cx(Gear.buttonStyles.button, Gear.buttonStyles.transparent)} {...props}>
      <Wallet SVG={SVG} name={name} />
      {children}
    </button>
  );
}

VaraWalletButton.Change = VaraWalletButtonChange;
GearWalletButton.Change = GearWalletButtonChange;

export { VaraWalletButton, GearWalletButton };
