import { useApi } from '@gear-js/react-hooks';

import { ICON, LOGO } from '@/widgets/menu/model/consts';

function useNetworkIcon() {
  const { api, isApiReady } = useApi();

  const genesis = isApiReady ? api.genesisHash.toHex() : undefined;

  const genesisLogo = genesis ? LOGO[genesis] : undefined;
  const logo = genesisLogo || ICON.gear;

  const { SVG, SHORT_SVG: ShortSVG, NETWORK: NetworkSVG } = logo;

  return { SVG, ShortSVG, NetworkSVG };
}

export { useNetworkIcon };
