import { GENESIS } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';

import { FAUCET_API_URL } from './consts';

type GetTestBalanceParameters = {
  token: string;
  address: string;
};

const getTestBalance = ({ token, address }: GetTestBalanceParameters) =>
  fetchWithGuard({
    url: `${FAUCET_API_URL}/balance`,
    method: 'POST',
    parameters: { token, payload: { address, genesis: GENESIS.TESTNET } },
    isJson: false,
  });

export { getTestBalance };
