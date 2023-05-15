import { ReactComponent as VaraSVG } from 'shared/assets/images/logos/vara.svg';
import { ReactComponent as ShortVaraSVG } from 'shared/assets/images/logos/shortcut/vara.svg';
import { ReactComponent as NetworkVaraSVG } from 'shared/assets/images/logos/networks/vara.svg';

const DEVELOPMENT_SECTION = 'development';

const GENESIS = {
  VARA_TESTNET: '0x69599490fc00e8c5636ec255f4eee61d1ca950dd87df7a32cd92b6c8f61dbe28',
  VARA: '0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763',
};

const VARA_LOGO = { SVG: VaraSVG, SHORT_SVG: ShortVaraSVG, NETWORK: NetworkVaraSVG };

const LOGO = {
  [GENESIS.VARA_TESTNET]: VARA_LOGO,
  [GENESIS.VARA]: VARA_LOGO,
};

const NODE_SECTIONS = [
  {
    caption: 'Vara Stable Testnet',
    nodes: [
      {
        isCustom: false,
        address: 'wss://testnet.vara.rs',
        SVG: NetworkVaraSVG,
      },
      {
        isCustom: false,
        address: 'wss://archive-testnet.vara.rs',
        SVG: NetworkVaraSVG,
      },
    ],
  },
  {
    caption: 'Gear Staging Testnet V7',
    nodes: [
      {
        isCustom: false,
        address: 'wss://rpc-node.gear-tech.io',
      },
      {
        isCustom: false,
        address: 'wss://archive-node.gear-tech.io',
      },
    ],
  },
  {
    caption: 'vara network',
    nodes: [
      {
        isCustom: false,
        address: 'wss://rpc.vara-network.io',
        SVG: NetworkVaraSVG,
      },
      {
        isCustom: false,
        address: 'wss://archive-rpc.vara-network.io',
        SVG: NetworkVaraSVG,
      },
    ],
  },
  {
    caption: 'development',
    nodes: [
      {
        isCustom: false,
        address: 'ws://localhost:9944',
      },
    ],
  },
];

export { DEVELOPMENT_SECTION, LOGO, NODE_SECTIONS };
