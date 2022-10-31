import PolkadotSVG from 'shared/assets/images/wallets/polkadot.svg';
import SubwalletSVG from 'shared/assets/images/wallets/subwallet.svg';
import TalismanSVG from 'shared/assets/images/wallets/talisman.svg';

const WALLET = {
  'polkadot-js': { name: 'Polkadot JS', icon: PolkadotSVG },
  'subwallet-js': { name: 'Subwallet', icon: SubwalletSVG },
  talisman: { name: 'Talisman', icon: TalismanSVG },
};

const WALLETS = Object.keys(WALLET);

export { WALLET, WALLETS };
