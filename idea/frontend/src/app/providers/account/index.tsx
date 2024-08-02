import { ProviderProps } from '@gear-js/react-hooks';
import {
  InjectedAccount,
  InjectedAccountWithMeta,
  InjectedWindow,
  InjectedWindowProvider,
} from '@polkadot/extension-inject/types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const WALLET_STATUS = {
  INJECTED: 'injected',
  CONNECTED: 'connected',
} as const;

type WalletStatus = typeof WALLET_STATUS[keyof typeof WALLET_STATUS];

type Wallet = {
  id: string;
  status: WalletStatus;
  version?: string;
  accounts?: InjectedAccount[];
  connect: () => Promise<void>;
};

type Wallets = Record<string, Wallet>;

type Value = {
  wallets: Wallets | undefined;
};

const DEFAULT_VALUE = {
  wallets: undefined,
} as const;

const DEFAULT_INJECT_TIMEOUT_MS = 200 as const;

const LOCAL_STORAGE_KEY = {
  WALLET_IDS: 'walletIds',
} as const;

const AccountContext = createContext<Value>(DEFAULT_VALUE);
const { Provider } = AccountContext;

const useAccount = () => useContext(AccountContext);

type Props = ProviderProps & {
  appName?: string;
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

function AccountProvider({ appName = 'Gear dApp', children }: Props) {
  const [wallets, setWallets] = useState<Wallets>();
  console.log('wallets: ', wallets);
  const [walletId, setWalletId] = useState('');
  const [account, setAccount] = useState<InjectedAccountWithMeta>();

  const login = (id: string, address: string) => {};

  const getAccountWithMeta =
    (source: string) =>
    ({ address, name, genesisHash, type }: InjectedAccount) => ({
      address,
      meta: { source, name, genesisHash },
      type,
    });

  const getConnectedWallet = async (id: string, wallet: InjectedWindowProvider) => {
    const connect = wallet.connect || wallet.enable;

    if (!connect) throw new Error('Connection method is not found');

    const { version } = wallet;
    const status = WALLET_STATUS.CONNECTED;
    const connectedWallet = await connect(appName);
    const accounts = await connectedWallet.accounts.get();

    return { id, version, status, accounts, connect: () => Promise.reject(new Error('Wallet is already connected')) };
  };

  const getInjectedWallet = (id: string, wallet: InjectedWindowProvider) => {
    const { version } = wallet;
    const status = WALLET_STATUS.INJECTED;

    const connect = async () => {
      const connectedWallet = await getConnectedWallet(id, wallet);

      addLocalStorageWalletId(id);
      setWallets((prevWallets) => ({ ...prevWallets, [id]: connectedWallet }));
    };

    return { id, version, status, connect };
  };

  const initializeWallets = async () => {
    const { injectedWeb3 } = window as unknown as InjectedWindow;
    if (!injectedWeb3) return;

    const savedWalletIds = getLocalStorageWalletIds();
    const walletEntries = Object.entries(injectedWeb3);

    const promiseEntries = walletEntries.map(
      async ([id, wallet]) =>
        [
          id,
          savedWalletIds.includes(id) ? await getConnectedWallet(id, wallet) : getInjectedWallet(id, wallet),
        ] as const,
    );

    const result = Object.fromEntries(await Promise.all(promiseEntries));

    setWallets(result);
  };

  useEffect(() => {
    const timeoutId = setTimeout(initializeWallets, DEFAULT_INJECT_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ wallets }), [wallets]);

  return <Provider value={value}>{children}</Provider>;
}

export { AccountProvider as NewAccountProvider, useAccount as useNewAccount };
