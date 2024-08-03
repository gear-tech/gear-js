import { decodeAddress, HexString } from '@gear-js/api';
import { ProviderProps } from '@gear-js/react-hooks';
import {
  InjectedAccount,
  InjectedAccountWithMeta,
  InjectedWindow,
  InjectedWindowProvider,
  Unsubcall,
} from '@polkadot/extension-inject/types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const WALLET_STATUS = {
  INJECTED: 'injected',
  CONNECTED: 'connected',
} as const;

type WalletStatus = typeof WALLET_STATUS[keyof typeof WALLET_STATUS];

type Account = InjectedAccountWithMeta & {
  decodedAddress: HexString;
};

type Wallet = {
  id: string;
  status: WalletStatus;
  version?: string;
  accounts?: Account[];
  connect: () => Promise<void>;
  subscribeToAccountsChange?: (callback: (accounts: InjectedAccount[]) => void) => Unsubcall;
};

type Wallets = Record<string, Wallet>;

type Value = {
  wallets: Wallets | undefined;
  account: Account | undefined;
  login: (account: Account) => void;
  logout: () => void;
};

const DEFAULT_VALUE = {
  wallets: undefined,
  account: undefined,
  login: () => {},
  logout: () => {},
} as const;

const DEFAULT_INJECT_TIMEOUT_MS = 200 as const;

const LOCAL_STORAGE_KEY = {
  WALLET_IDS: 'walletIds',
  ACCOUNT_ADDRESS: 'accountAddress',
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
  const [account, setAccount] = useState<Account>();

  const login = (_account: Account) => {
    setAccount(_account);
    localStorage.setItem(LOCAL_STORAGE_KEY.ACCOUNT_ADDRESS, _account.address);
  };

  const logout = () => {
    setAccount(undefined);
    localStorage.removeItem(LOCAL_STORAGE_KEY.ACCOUNT_ADDRESS);
  };

  const getAccount =
    (source: string) =>
    ({ address, name, genesisHash, type }: InjectedAccount) => ({
      address,
      decodedAddress: decodeAddress(address),
      meta: { source, name, genesisHash },
      type,
    });

  const getConnectedWallet = async (id: string, wallet: InjectedWindowProvider) => {
    const connect = wallet.connect || wallet.enable;

    if (!connect) throw new Error('Connection method is not found');

    const { version } = wallet;
    const status = WALLET_STATUS.CONNECTED;
    const connectedWallet = await connect(appName);

    const accounts = (await connectedWallet.accounts.get()).map(getAccount(id));
    const subscribeToAccountsChange = connectedWallet.accounts.subscribe;

    return {
      id,
      version,
      status,
      accounts,
      connect: () => Promise.reject(new Error('Wallet is already connected')),
      subscribeToAccountsChange,
    };
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

  const initalizeAccountSubscriptions = (_wallets: Wallets) => {
    return Object.entries(_wallets).map(([id, { subscribeToAccountsChange }]) =>
      subscribeToAccountsChange
        ? subscribeToAccountsChange((accounts) =>
            setWallets((prevWallets) =>
              prevWallets
                ? { ...prevWallets, [id]: { ...prevWallets[id], accounts: accounts.map(getAccount(id)) } }
                : prevWallets,
            ),
          )
        : undefined,
    );
  };

  const getWallets = async () => {
    const { injectedWeb3 } = window as unknown as InjectedWindow;
    if (!injectedWeb3) return {};

    const promiseEntries = Object.entries(injectedWeb3).map(
      async ([id, wallet]) =>
        [
          id,
          getLocalStorageWalletIds().includes(id)
            ? await getConnectedWallet(id, wallet)
            : getInjectedWallet(id, wallet),
        ] as const,
    );

    return Object.fromEntries(await Promise.all(promiseEntries));
  };

  const getLoggedInAccount = (_wallets: Wallets) => {
    const localStorageAccountAddress = localStorage.getItem(LOCAL_STORAGE_KEY.ACCOUNT_ADDRESS);

    if (!localStorageAccountAddress) return;

    return Object.values(_wallets)
      .flatMap(({ accounts }) => accounts)
      .find((_account) => _account?.address === localStorageAccountAddress);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getWallets().then((result) => {
        setWallets(result);
        setAccount(getLoggedInAccount(result));

        // TODO: unsubs
        // TODO: what if logged in account will be removed?
        initalizeAccountSubscriptions(result);
      });
    }, DEFAULT_INJECT_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ wallets, account, login, logout }), [wallets, account]);

  return <Provider value={value}>{children}</Provider>;
}

export { AccountProvider as NewAccountProvider, useAccount as useNewAccount };
