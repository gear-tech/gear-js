import { ReactComponent as PolkadotSVG } from 'shared/assets/images/wallets/polkadot.svg';
import { ReactComponent as SubwalletSVG } from 'shared/assets/images/wallets/subwallet.svg';
import { ReactComponent as TalismanSVG } from 'shared/assets/images/wallets/talisman.svg';

const WALLET = {
  'polkadot-js': { name: 'Polkadot JS', icon: PolkadotSVG },
  'subwallet-js': { name: 'SubWallet', icon: SubwalletSVG },
  talisman: { name: 'Talisman', icon: TalismanSVG },
};

const WALLETS = Object.keys(WALLET);

export { WALLET, WALLETS };
