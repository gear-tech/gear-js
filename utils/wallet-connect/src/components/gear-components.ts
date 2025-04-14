import * as Gear from '@gear-js/ui';

import { GearAccountButton } from './account-button/gear-account-button';
import { GearWalletButton } from './wallet-button/gear-wallet-button';

export const GearComponents = {
  Button: Gear.Button,
  AccountButton: GearAccountButton,
  WalletButton: GearWalletButton,
  Modal: Gear.Modal,
} as const;

type GearComponentsType = typeof GearComponents;

export default GearComponents;
export type { GearComponentsType };
