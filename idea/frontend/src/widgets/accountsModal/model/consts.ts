import PolkadotSVG from 'shared/assets/images/wallets/polkadot.svg?react';
import SubwalletSVG from 'shared/assets/images/wallets/subwallet.svg?react';
import TalismanSVG from 'shared/assets/images/wallets/talisman.svg?react';
import EnkryptSVG from 'shared/assets/images/wallets/enkrypt.svg?react';

const WALLET = {
  'polkadot-js': { name: 'Polkadot JS', icon: PolkadotSVG },
  'subwallet-js': { name: 'SubWallet', icon: SubwalletSVG },
  talisman: { name: 'Talisman', icon: TalismanSVG },
  enkrypt: { name: 'Enkrypt', icon: EnkryptSVG },
};

const WALLETS = Object.keys(WALLET);

export { WALLET, WALLETS };
