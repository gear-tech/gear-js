import GearSVG from '@/shared/assets/images/logos/gear.svg?react';
import ShortGearSVG from '@/shared/assets/images/logos/shortcut/gear.svg?react';
import GearNetworkSVG from '@/shared/assets/images/logos/networks/gear.svg?react';
import VaraSVG from '@/shared/assets/images/logos/vara.svg?react';
import ShortVaraSVG from '@/shared/assets/images/logos/shortcut/vara.svg?react';
import NetworkVaraSVG from '@/shared/assets/images/logos/networks/vara.svg?react';

const DEVELOPMENT_SECTION = 'development';

const GENESIS = {
  VARA: '0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763',
  VARA_TESTNET: '0x525639f713f397dcf839bd022cd821f367ebcf179de7b9253531f8adbe5436d6',
};

// TODO: think about naming of ICON and LOGO, and overall structure
const ICON = {
  vara: { SVG: VaraSVG, SHORT_SVG: ShortVaraSVG, NETWORK: NetworkVaraSVG },
  gear: { SVG: GearSVG, SHORT_SVG: ShortGearSVG, NETWORK: GearNetworkSVG },
};

const LOGO = {
  [GENESIS.VARA]: ICON.vara,
  [GENESIS.VARA_TESTNET]: ICON.vara,
};

export { DEVELOPMENT_SECTION, ICON, LOGO };
