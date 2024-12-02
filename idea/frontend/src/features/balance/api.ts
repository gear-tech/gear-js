import { GENESIS } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';
import { FAUCET_API_URL } from './consts';

type GetTestBalanceParameters = {
  token: string;
  address: string;
};

const getTestBalance = ({ token, address }: GetTestBalanceParameters) =>
  fetchWithGuard(`${FAUCET_API_URL}/balance`, 'POST', { token, payload: { address, genesis: GENESIS.TESTNET } });
export { getTestBalance };
