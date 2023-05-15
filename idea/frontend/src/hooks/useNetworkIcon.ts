import { useApi } from '@gear-js/react-hooks';

import { ReactComponent as GearSVG } from 'shared/assets/images/logos/gear.svg';
import { ReactComponent as ShortGearSVG } from 'shared/assets/images/logos/shortcut/gear.svg';
import { ReactComponent as DefaultNetworkSVG } from 'shared/assets/images/logos/networks/gear.svg';
import { LOGO } from 'widgets/menu/model/consts';

function useNetworkIcon() {
  const { api, isApiReady } = useApi();

  const genesis = isApiReady ? api.genesisHash.toHex() : undefined;

  const logo = genesis ? LOGO[genesis] : undefined;
  const SVG = logo?.SVG || GearSVG;
  const ShortSVG = logo?.SHORT_SVG || ShortGearSVG;
  const NetworkSVG = logo?.NETWORK || DefaultNetworkSVG;

  return { SVG, ShortSVG, NetworkSVG };
}

export { useNetworkIcon };
