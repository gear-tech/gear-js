import { Entries } from '@/shared/types';

import PolkadotSVG from './assets/polkadot.svg?react';
import SubwalletSVG from './assets/subwallet.svg?react';
import TalismanSVG from './assets/talisman.svg?react';
import EnkryptSVG from './assets/enkrypt.svg?react';

const WALLET = {
  'polkadot-js': { name: 'Polkadot JS', SVG: PolkadotSVG },
  'subwallet-js': { name: 'SubWallet', SVG: SubwalletSVG },
  talisman: { name: 'Talisman', SVG: TalismanSVG },
  enkrypt: { name: 'Enkrypt', SVG: EnkryptSVG },
};

const WALLETS = Object.entries(WALLET) as Entries<typeof WALLET>;

export { WALLET, WALLETS };
