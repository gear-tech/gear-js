import EnkryptSVG from './assets/enkrypt.svg';
import PolkadotSVG from './assets/polkadot.svg';
import SubWalletSVG from './assets/subwallet.svg';
import TalismanSVG from './assets/talisman.svg';
import NovaSVG from './assets/nova.svg';
import { Wallets } from './types';

const IS_MOBILE_DEVICE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

type InjectedWindow = Window & { walletExtension?: { isNovaWallet: boolean } };
const isNovaWallet = Boolean((window as unknown as InjectedWindow).walletExtension?.isNovaWallet);

const WALLET = isNovaWallet
  ? {
      'polkadot-js': { name: 'Nova Wallet', SVG: NovaSVG },
      'subwallet-js': { name: 'SubWallet', SVG: SubWalletSVG },
    }
  : {
      'polkadot-js': { name: 'Polkadot JS', SVG: PolkadotSVG },
      'subwallet-js': { name: 'SubWallet', SVG: SubWalletSVG },
      talisman: { name: 'Talisman', SVG: TalismanSVG },
      enkrypt: { name: 'Enkrypt', SVG: EnkryptSVG },
    };

const WALLETS = Object.entries(WALLET) as Wallets;

export { IS_MOBILE_DEVICE, WALLET, WALLETS, isNovaWallet };
