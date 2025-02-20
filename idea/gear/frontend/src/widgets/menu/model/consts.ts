import GearSVG from '@/shared/assets/images/logos/gear.svg?react';
import GearNetworkSVG from '@/shared/assets/images/logos/networks/gear.svg?react';
import NetworkVaraSVG from '@/shared/assets/images/logos/networks/vara.svg?react';
import ShortGearSVG from '@/shared/assets/images/logos/shortcut/gear.svg?react';
import ShortVaraSVG from '@/shared/assets/images/logos/shortcut/vara.svg?react';
import VaraSVG from '@/shared/assets/images/logos/vara.svg?react';
import { GENESIS } from '@/shared/config';

const DEVELOPMENT_SECTION = 'development';

// TODO: think about naming of ICON and LOGO, and overall structure
const ICON = {
  vara: { SVG: VaraSVG, SHORT_SVG: ShortVaraSVG, NETWORK: NetworkVaraSVG },
  gear: { SVG: GearSVG, SHORT_SVG: ShortGearSVG, NETWORK: GearNetworkSVG },
};

const LOGO = {
  [GENESIS.MAINNET]: ICON.vara,
  [GENESIS.TESTNET]: ICON.vara,
};

export { DEVELOPMENT_SECTION, ICON, LOGO };
