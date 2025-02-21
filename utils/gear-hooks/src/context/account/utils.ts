import { decodeAddress } from '@gear-js/api';
import { Keyring } from '@polkadot/api';
import { InjectedAccount, InjectedWindowProvider, InjectedWindow, Unsubcall } from '@polkadot/extension-inject/types';
import { Signer } from '@polkadot/types/types';

import { VARA_SS58_FORMAT } from '../../consts';

import { LOCAL_STORAGE_KEY, WALLET_STATUS } from './consts';
import { Account, Wallet, Wallets } from './types';

const getAccounts = (source: string, signer: Signer, accounts: InjectedAccount[]): Account[] =>
  accounts.map(({ address, name, genesisHash, type }) => {
    const decodedAddress = decodeAddress(address);

    return {
      address: new Keyring().encodeAddress(decodedAddress, VARA_SS58_FORMAT),
      decodedAddress,
      meta: { source, name, genesisHash },
      type,
      signer,
    };
  });

const getLoggedInAccount = (_wallets: Wallets) => {
  const localStorageAccountAddress = localStorage.getItem(LOCAL_STORAGE_KEY.ACCOUNT_ADDRESS);

  if (!localStorageAccountAddress) return;

  return Object.values(_wallets)
    .flatMap(({ accounts }) => accounts)
    .find((_account) => _account?.address === localStorageAccountAddress);
};

const getLocalStorageWalletIds = () => {
  const result = localStorage.getItem(LOCAL_STORAGE_KEY.WALLET_IDS);

  return result ? (JSON.parse(result) as string[]) : [];
};

const addLocalStorageWalletId = (id: string) => {
  const uniqueIds = new Set([...getLocalStorageWalletIds(), id]);
  const result = JSON.stringify(Array.from(uniqueIds));

  localStorage.setItem(LOCAL_STORAGE_KEY.WALLET_IDS, result);
};

const getConnectedWallet = async (
  origin: string,
  id: string,
  wallet: InjectedWindowProvider,
  onAccountsChange: (_id: string, value: Account[]) => void,
  registerUnsub: (unsub: Unsubcall) => void,
) => {
  try {
    const connect = wallet.connect || wallet.enable;

    if (!connect) throw new Error('Connection method is not found');

    const { version } = wallet;
    const status = WALLET_STATUS.CONNECTED;

    // if auth popup closed/rejected,
    // polkadot-js extension will not resolve promise at all
    const connectedWallet = await connect(origin);
    const { signer } = connectedWallet;

    // every other extension will throw error there
    // it is hacky, but works for right now. worth to consider better solution to handle loading state
    const accounts = getAccounts(id, signer, await connectedWallet.accounts.get());

    // probably it instantly writes to state on a first call. need to investigate
    const accountsUnsub = connectedWallet.accounts.subscribe((result) =>
      onAccountsChange(id, getAccounts(id, signer, result)),
    );

    registerUnsub(accountsUnsub);

    return {
      id,
      version,
      status,
      accounts,
      connect: () => Promise.reject(new Error('Wallet is already connected')),
    };
  } catch (error) {
    console.error('Error while connecting wallet: ', error);
  }
};

const getInjectedWallet = (
  origin: string,
  id: string,
  wallet: InjectedWindowProvider,
  onAccountsChange: (_id: string, value: Account[]) => void,
  onConnect: (_id: string, _wallet: Wallet) => void,
  registerUnsub: (unsub: Unsubcall) => void,
) => {
  const { version } = wallet;
  const status = WALLET_STATUS.INJECTED;

  const connect = async () => {
    const connectedWallet = await getConnectedWallet(origin, id, wallet, onAccountsChange, registerUnsub);
    if (!connectedWallet) return;

    addLocalStorageWalletId(id);
    onConnect(id, connectedWallet);
  };

  return { id, version, status, connect };
};

const getWallets = async (
  origin: string,
  onAccountsChange: (_id: string, value: Account[]) => void,
  onWalletConnect: (_id: string, _wallet: Wallet) => void,
  registerUnsub: (unsub: Unsubcall) => void,
) => {
  const { injectedWeb3 } = window as unknown as InjectedWindow;
  if (!injectedWeb3) return {};

  const promiseEntries = Object.entries(injectedWeb3).map(
    async ([id, wallet]) =>
      [
        id,
        getLocalStorageWalletIds().includes(id)
          ? (await getConnectedWallet(origin, id, wallet, onAccountsChange, registerUnsub)) ||
            // in case if wallet was connected, but extension's auth access is not present,
            // localStorage entry still exists and we're trying to establish connection again
            getInjectedWallet(origin, id, wallet, onAccountsChange, onWalletConnect, registerUnsub)
          : getInjectedWallet(origin, id, wallet, onAccountsChange, onWalletConnect, registerUnsub),
      ] as const,
  );

  return Object.fromEntries(await Promise.all(promiseEntries));
};

export { getWallets, getLoggedInAccount };
