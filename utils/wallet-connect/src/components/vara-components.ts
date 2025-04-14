import * as Vara from '@gear-js/vara-ui';

import { VaraAccountButton } from './account-button/vara-account-button';
import { VaraWalletButton } from './wallet-button/vara-wallet-button';

export const VaraComponents = {
  Button: Vara.Button,
  AccountButton: VaraAccountButton,
  WalletButton: VaraWalletButton,
  Modal: Vara.Modal,
} as const;

type VaraComponentsType = typeof VaraComponents;

export default VaraComponents;
export { type VaraComponentsType };
