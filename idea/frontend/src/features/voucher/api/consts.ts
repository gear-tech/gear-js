import { GENESIS } from '@/shared/config';

const API_URL = {
  [GENESIS.MAINNET]: import.meta.env.VITE_MAINNET_VOUCHERS_API_URL as string,
  [GENESIS.TESTNET]: import.meta.env.VITE_TESTNET_VOUCHERS_API_URL as string,
} as const;

export { API_URL };
