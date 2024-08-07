import { decodeAddress } from '@gear-js/api';
import { Account } from '@gear-js/react-hooks';
import {
  InjectedAccount,
  Injected,
  InjectedWindowProvider,
  InjectedWindow,
  Unsubcall,
} from '@polkadot/extension-inject/types';

import { LOCAL_STORAGE_KEY, WALLET_STATUS } from './consts';
import { Wallet, Wallets } from './types';

const getAccount = (source: string, { address, name, genesisHash, type }: InjectedAccount) => ({
  address,
  decodedAddress: decodeAddress(address),
  meta: { source, name, genesisHash },
  type,
});

const watchAccounts = (id: string, { accounts }: Injected, onChange: (_id: string, value: Account[]) => void) => {
  const { subscribe } = accounts;
  let isFirstCall = true;

  return new Promise<[Account[], Unsubcall]>((resolve) => {
    const unsub = subscribe((accs) => {
      const result = accs.map((account) => getAccount(id, account));

      if (!isFirstCall) return onChange(id, result);

      isFirstCall = false;
      resolve([result, unsub]);
    });
  });
};

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
  const connect = wallet.connect || wallet.enable;

  if (!connect) throw new Error('Connection method is not found');

  const { version } = wallet;
  const status = WALLET_STATUS.CONNECTED;

  const connectedWallet = await connect(origin);
  const { signer } = connectedWallet;

  const [accounts, accountsUnsub] = await watchAccounts(id, connectedWallet, onAccountsChange);
  registerUnsub(accountsUnsub);

  return {
    id,
    version,
    status,
    accounts,
    signer,
    connect: () => Promise.reject(new Error('Wallet is already connected')),
  };
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
          ? await getConnectedWallet(origin, id, wallet, onAccountsChange, registerUnsub)
          : getInjectedWallet(origin, id, wallet, onAccountsChange, onWalletConnect, registerUnsub),
      ] as const,
  );

  return Object.fromEntries(await Promise.all(promiseEntries));
};

export { getWallets, getLoggedInAccount };
