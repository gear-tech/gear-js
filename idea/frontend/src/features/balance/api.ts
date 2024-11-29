import ky from 'ky';

import { FAUCET_API_URL, GENESIS } from '@/shared/config';

type GetTestBalanceParameters = {
  token: string;
  address: string;
};

const getTestBalance = ({ token, address }: GetTestBalanceParameters) =>
  ky.post(`${FAUCET_API_URL}/balance`, {
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token, payload: { address, genesis: GENESIS.TESTNET } }),
    timeout: 30000,
  });
export { getTestBalance };
