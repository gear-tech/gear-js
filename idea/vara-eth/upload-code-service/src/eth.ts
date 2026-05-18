import { createLogger } from '@gear-js/logger';
import { getRouterClient, type RouterClient } from '@vara-eth/api/eth/router';
import { walletClientToSigner } from '@vara-eth/api/signer';
import {
  type Address,
  createPublicClient,
  createWalletClient,
  type Hash,
  type Hex,
  type PublicClient,
  parseSignature,
  webSocket,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import type { NetworkConfig } from './shared/types.js';

const logger = createLogger('eth');

type ClientPair = { routerClient: RouterClient; publicClient: PublicClient };

const _clientCache = new Map<string, ClientPair>();

async function getClients(networkConfig: NetworkConfig): Promise<ClientPair> {
  const cached = _clientCache.get(networkConfig.name);
  if (cached) return cached;

  const transport = webSocket(networkConfig.ethereumRpcUrl);
  const account = privateKeyToAccount(networkConfig.privateKey);

  const publicClient = createPublicClient({ transport });
  const walletClient = createWalletClient({ transport, account });
  const signer = walletClientToSigner(walletClient);
  const routerClient = getRouterClient({ address: networkConfig.routerAddress, publicClient, signer });

  const pair: ClientPair = { routerClient, publicClient };
  _clientCache.set(networkConfig.name, pair);

  logger.info(
    {
      network: networkConfig.name,
      rpc: networkConfig.ethereumRpcUrl,
      account: account.address,
      router: networkConfig.routerAddress,
    },
    'Clients created',
  );
  return pair;
}

export type PreparedTx = Awaited<ReturnType<RouterClient['requestCodeValidationOnBehalf']>>;

export async function prepareCodeValidation(
  networkConfig: NetworkConfig,
  code: Uint8Array,
  codeId: Hash,
  sender: Address,
  blobHashes: Hash[],
  deadline: bigint,
  wvaraPermitSignature: Hex,
  requestCodeValidationSignature: Hex,
): Promise<PreparedTx> {
  const { routerClient } = await getClients(networkConfig);

  logger.info({ sender, codeId }, 'Preparing code validation request');

  const tx = await routerClient.requestCodeValidationOnBehalf(
    sender,
    code,
    blobHashes,
    deadline,
    parseSignature(requestCodeValidationSignature),
    parseSignature(wvaraPermitSignature),
  );

  if (tx.codeId.toLowerCase() !== codeId.toLowerCase()) {
    logger.warn({ expected: codeId, actual: tx.codeId }, 'Code ID mismatch');
    throw new Error(`Code ID mismatch: expected ${codeId}, got ${tx.codeId}`);
  }

  return tx;
}

export async function sendCodeValidation(
  networkConfig: NetworkConfig,
  tx: PreparedTx,
): Promise<{ transactionHash: Hash; status: 'success' | 'reverted' }> {
  const { publicClient } = await getClients(networkConfig);
  logger.info({ codeId: tx.codeId }, 'Sending code validation request');
  const transactionHash = await tx.send();
  logger.info({ codeId: tx.codeId, transactionHash }, 'Transaction submitted, waiting for receipt');
  const receipt = await publicClient.waitForTransactionReceipt({ hash: transactionHash });
  logger.info(
    { codeId: tx.codeId, transactionHash, status: receipt.status, blockNumber: receipt.blockNumber },
    'Receipt received',
  );
  return { transactionHash, status: receipt.status };
}
