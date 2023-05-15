import { ReactComponent as VaraSVG } from 'shared/assets/images/logos/vara.svg';
import { ReactComponent as ShortVaraSVG } from 'shared/assets/images/logos/shortcut/vara.svg';
import { ReactComponent as NetworkVaraSVG } from 'shared/assets/images/logos/networks/vara.svg';

const DEVELOPMENT_SECTION = 'development';

const GENESIS = {
  VARA: '0x69599490fc00e8c5636ec255f4eee61d1ca950dd87df7a32cd92b6c8f61dbe28',
};

const LOGO = {
  [GENESIS.VARA]: { SVG: VaraSVG, SHORT_SVG: ShortVaraSVG },
};

const NODE_SECTIONS = [
  {
    caption: 'test network',
    nodes: [
      {
        isCustom: false,
        address: 'wss://rpc-node.gear-tech.io:443',
      },
      {
        isCustom: false,
        address: 'wss://rpc-node.gear-tech.io:443',
        SVG: NetworkVaraSVG,
      },
    ],
  },
  {
    caption: 'workshop',
    nodes: [
      {
        isCustom: false,
        address: 'wss://node-workshop.gear.rs:443',
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
