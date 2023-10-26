import { VARA_GENESIS, VARA_TESTNET_GENESIS } from '@gear-js/api';

import GearSVG from '@/shared/assets/images/logos/gear.svg?react';
import ShortGearSVG from '@/shared/assets/images/logos/shortcut/gear.svg?react';
import GearNetworkSVG from '@/shared/assets/images/logos/networks/gear.svg?react';
import VaraSVG from '@/shared/assets/images/logos/vara.svg?react';
import ShortVaraSVG from '@/shared/assets/images/logos/shortcut/vara.svg?react';
import NetworkVaraSVG from '@/shared/assets/images/logos/networks/vara.svg?react';

const DEVELOPMENT_SECTION = 'development';

const GENESIS = {
  VARA: VARA_GENESIS,
  VARA_TESTNET: VARA_TESTNET_GENESIS,
  VARA_VIT: '0x9b86ea7366584c5ddf67de243433fcc05732864933258de9467db46eb9bef8b5',
};

// TODO: think about naming of ICON and LOGO, and overall structure
const ICON = {
  vara: { SVG: VaraSVG, SHORT_SVG: ShortVaraSVG, NETWORK: NetworkVaraSVG },
  gear: { SVG: GearSVG, SHORT_SVG: ShortGearSVG, NETWORK: GearNetworkSVG },
};

const LOGO = {
  [GENESIS.VARA]: ICON.vara,
  [GENESIS.VARA_TESTNET]: ICON.vara,
  [GENESIS.VARA_VIT]: ICON.vara,
};

export { DEVELOPMENT_SECTION, ICON, LOGO };
