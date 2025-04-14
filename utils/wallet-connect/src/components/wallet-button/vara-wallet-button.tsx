import * as Vara from '@gear-js/vara-ui';

import { Wallet, WalletButtonProps, WalletProps } from './wallet-button';
import styles from './wallet-button.module.scss';

function VaraWalletButton({ children, SVG, name, ...props }: WalletButtonProps & WalletProps) {
  return (
    <Vara.Button className={styles.button} color="plain" size="small" block {...props}>
      <Wallet SVG={SVG} name={name} />
      {children}
    </Vara.Button>
  );
}

function VaraWalletButtonChange({ SVG, name, children, ...props }: Omit<WalletButtonProps, 'disabled'> & WalletProps) {
  return (
    <Vara.Button color="transparent" {...props}>
      <Wallet SVG={SVG} name={name} />
      {children}
    </Vara.Button>
  );
}

VaraWalletButton.Change = VaraWalletButtonChange;

export { VaraWalletButton };
