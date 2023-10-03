import { ReactComponent as GearSVG } from 'shared/assets/images/logos/gear.svg';
import { ReactComponent as ShortGearSVG } from 'shared/assets/images/logos/shortcut/gear.svg';
import { ReactComponent as GearNetworkSVG } from 'shared/assets/images/logos/networks/gear.svg';

import { ReactComponent as VaraSVG } from 'shared/assets/images/logos/vara.svg';
import { ReactComponent as ShortVaraSVG } from 'shared/assets/images/logos/shortcut/vara.svg';
import { ReactComponent as NetworkVaraSVG } from 'shared/assets/images/logos/networks/vara.svg';

const DEVELOPMENT_SECTION = 'development';

const GENESIS = {
  VARA: '0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763',
  VARA_TESTNET: '0x525639f713f397dcf839bd022cd821f367ebcf179de7b9253531f8adbe5436d6',
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
