import { GENESIS } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';

import { FAUCET_API_URL } from './consts';

type GetTestBalanceParameters = {
  token: string;
  address: string;
};

type MainnetChallenge = {
  challengeId: string;
  messageHex: string;
  expiresAt: string;
};

type CreateMainnetClaimParameters = {
  address: string;
  challengeId: string;
  signature: string;
  turnstileToken: string;
  deviceToken: string;
  idempotencyKey: string;
};

type MainnetClaim = {
  claimId?: string;
  status: string;
  amount?: string;
  transactionHash?: string | null;
  blockHash?: string | null;
  reasonCode?: string;
};

const getTestBalance = ({ token, address }: GetTestBalanceParameters) =>
  fetchWithGuard({
    url: `${FAUCET_API_URL}/balance`,
    method: 'POST',
    parameters: { token, payload: { address, genesis: GENESIS.TESTNET } },
    isJson: false,
  });

const getMainnetChallenge = (address: string) =>
  fetchMainnetJson<MainnetChallenge>('/challenge', {
    method: 'POST',
    parameters: { address },
  });

const createMainnetClaim = ({
  idempotencyKey,
  address,
  challengeId,
  signature,
  turnstileToken,
  deviceToken,
}: CreateMainnetClaimParameters) =>
  fetchMainnetJson<MainnetClaim>('/claims', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    parameters: { address, challengeId, signature, turnstileToken, deviceToken },
  });

const getMainnetClaim = (claimId: string) => fetchMainnetJson<MainnetClaim>(`/claims/${encodeURIComponent(claimId)}`);

type FetchMainnetJsonOptions = {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  parameters?: object;
};

const fetchMainnetJson = async <T>(
  path: string,
  { method = 'GET', headers, parameters }: FetchMainnetJsonOptions = {},
) => {
  const response = await fetch(`${FAUCET_API_URL}/mainnet${path}`, {
    method,
    headers: { 'Content-Type': 'application/json;charset=utf-8', ...headers },
    body: parameters ? JSON.stringify(parameters) : undefined,
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => ({}))) as unknown;
    const message =
      result !== null && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
        ? result.error
        : response.statusText;

    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

export type { MainnetChallenge, MainnetClaim };
export { createMainnetClaim, getMainnetChallenge, getMainnetClaim, getTestBalance };
