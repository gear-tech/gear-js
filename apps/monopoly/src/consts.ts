import { ReactComponent as AcalaSVG } from 'assets/images/logos/acala.svg';
import { ReactComponent as AstarSVG } from 'assets/images/logos/astar.svg';
import { ReactComponent as BifrostSVG } from 'assets/images/logos/bifrost.svg';
import centrifuge from 'assets/images/logos/centrifuge.png';
import { ReactComponent as DockSVG } from 'assets/images/logos/dock.svg';
import { ReactComponent as EfinitySVG } from 'assets/images/logos/efinity.svg';
import hydradx from 'assets/images/logos/hydradx.png';
import i from 'assets/images/logos/i.png';
import { ReactComponent as InterlaySVG } from 'assets/images/logos/interlay.svg';
import { ReactComponent as KiltSVG } from 'assets/images/logos/kilt.svg';
import { ReactComponent as KusamaSVG } from 'assets/images/logos/kusama.svg';
import { ReactComponent as LitentrySVG } from 'assets/images/logos/litentry.svg';
import { ReactComponent as MSVG } from 'assets/images/logos/m.svg';
import { ReactComponent as MoonbeamSVG } from 'assets/images/logos/moonbeam.svg';
import { ReactComponent as NodleSVG } from 'assets/images/logos/nodle.svg';
import { ReactComponent as NovaSVG } from 'assets/images/logos/nova.svg';
import { ReactComponent as ParallelSVG } from 'assets/images/logos/parallel.svg';
import { ReactComponent as PhalaSVG } from 'assets/images/logos/phala.svg';
import { ReactComponent as PolkadotSVG } from 'assets/images/logos/polkadot.svg';
import { ReactComponent as PolkadotJsSVG } from 'assets/images/logos/polkadotjs.svg';
import { ReactComponent as RmrkSVG } from 'assets/images/logos/rmrk.svg';
import { ReactComponent as RobonomicsSVG } from 'assets/images/logos/robonomics.svg';
import { ReactComponent as SubquerySVG } from 'assets/images/logos/subquery.svg';
import { ReactComponent as SubsocialSVG } from 'assets/images/logos/subsocial.svg';
import subsquid from 'assets/images/logos/subsquid.png';
import subwallet from 'assets/images/logos/subwallet.png';
import { ReactComponent as TalismanSVG } from 'assets/images/logos/talisman.svg';
import unique from 'assets/images/logos/unique.png';

import { ReactComponent as ErrorSVG } from 'assets/images/logos/error.svg';
import { ReactComponent as FireSVG } from 'assets/images/logos/fire.svg';
import { ReactComponent as GasSVG } from 'assets/images/logos/gas.svg';
import { ReactComponent as GearSVG } from 'assets/images/logos/gear.svg';
import { ReactComponent as HackSVG } from 'assets/images/logos/hack.svg';
import { ReactComponent as VaraSVG } from 'assets/images/logos/vara.svg';
import { Hex } from '@gear-js/api';
import { PlayerType } from 'types';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  CONTRACT: process.env.REACT_APP_CONTRACT_ADDRESS as Hex,
};

enum LocalStorage {
  Account = 'account',
  Wallet = 'wallet',
  Player = 'player',
}

const fields = [
  { Image: GearSVG, type: 'none' },
  {
    Image: NodleSVG,
    type: 'cell',
    values: {
      heading: 'Nodle',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: FireSVG,
    type: 'none',
  },
  {
    Image: RobonomicsSVG,
    type: 'cell',
    values: {
      heading: 'Robonomics Network',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  { Image: ErrorSVG, type: 'none' },
  {
    Image: PolkadotJsSVG,
    type: 'cell',
    values: {
      heading: 'polkadot{.js}',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: MSVG,
    type: 'cell',
    values: {
      heading: 'GM',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  { Image: FireSVG, type: 'none' },
  {
    Image: i,
    type: 'cell',
    values: {
      heading: 'ChaosDAO',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: SubsocialSVG,
    type: 'cell',
    values: {
      heading: 'Subsocial',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  { Image: GasSVG, type: 'none' },
  {
    Image: InterlaySVG,
    type: 'cell',
    values: {
      heading: 'Interlay',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: SubquerySVG,
    type: 'cell',
    values: {
      heading: 'Subquery',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: BifrostSVG,
    type: 'cell',
    values: {
      heading: 'Bifrost',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: ParallelSVG,
    type: 'cell',
    values: {
      heading: 'Parallel',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: NovaSVG,
    type: 'cell',
    values: {
      heading: 'Nova',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  { Image: FireSVG, type: 'none' },
  {
    Image: LitentrySVG,
    type: 'cell',
    values: {
      heading: 'Litentry',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: DockSVG,
    type: 'cell',
    values: {
      heading: 'Dock',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: KiltSVG,
    type: 'cell',
    values: {
      heading: 'Kilt',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  { Image: VaraSVG, type: 'none' },
  {
    Image: unique,
    type: 'cell',
    values: {
      heading: 'Unique',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  { Image: FireSVG, type: 'none' },
  {
    Image: RmrkSVG,
    type: 'cell',
    values: {
      heading: 'RMRK',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: EfinitySVG,
    type: 'cell',
    values: {
      heading: 'Efinity',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: subwallet,
    type: 'cell',
    values: {
      heading: 'Subwallet',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: hydradx,
    type: 'cell',
    values: {
      heading: 'HydraDX',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: centrifuge,
    type: 'cell',
    values: {
      heading: 'Centrifuge',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: subsquid,
    type: 'cell',
    values: {
      heading: 'Subsquid',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: AcalaSVG,
    type: 'cell',
    values: {
      heading: 'Acala',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  { Image: HackSVG, type: 'none' },
  {
    Image: PhalaSVG,
    type: 'cell',
    values: {
      heading: 'Phala',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: AstarSVG,
    type: 'cell',
    values: {
      heading: 'Astar',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  { Image: FireSVG, type: 'none' },
  {
    Image: MoonbeamSVG,
    type: 'cell',
    values: {
      heading: 'Moonbeam',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  {
    Image: TalismanSVG,
    type: 'cell',
    values: {
      heading: 'Talisman',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  { Image: ErrorSVG, type: 'none' },
  {
    Image: KusamaSVG,
    type: 'cell',
    values: {
      heading: 'Kusama',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
  { Image: FireSVG, type: 'none' },
  {
    Image: PolkadotSVG,
    type: 'cell',
    values: {
      heading: 'Polkadot',
      baseRent: 240000,
      bronze: 240000,
      silver: 240000,
      gold: 240000,
      cell: 240000,
      deposit: 240000,
      buyout: 240000,
      branch: 240000,
    },
  },
];

const INIT_PLAYERS = [
  { color: 'pink' as PlayerType['color'] },
  { color: 'purple' as PlayerType['color'] },
  { color: 'yellow' as PlayerType['color'] },
  { color: 'green' as PlayerType['color'] },
];

export { ADDRESS, LocalStorage, fields, INIT_PLAYERS };
