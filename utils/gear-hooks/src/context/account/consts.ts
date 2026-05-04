const DEFAULT_INJECT_TIMEOUT_MS = 200;

const WALLET_STATUS = {
  INJECTED: 'injected',
  CONNECTED: 'connected',
} as const;

const LOCAL_STORAGE_KEY = {
  WALLET_IDS: 'walletIds',
  ACCOUNT_ADDRESS: 'accountAddress',
} as const;

export { DEFAULT_INJECT_TIMEOUT_MS, LOCAL_STORAGE_KEY, WALLET_STATUS };
