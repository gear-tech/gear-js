import { getRouterClient } from '@vara-eth/api/eth/router';
import { walletClientToSigner } from '@vara-eth/api/signer';
import { createPublicClient, createWalletClient, type Hash, webSocket } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { getConfig } from './config.js';

let _routerClient: ReturnType<typeof getRouterClient> | null = null;
let _publicClient: ReturnType<typeof createPublicClient> | null = null;

async function getClients() {
  if (_routerClient && _publicClient) return { routerClient: _routerClient, publicClient: _publicClient };

  const config = await getConfig();
  const transport = webSocket(config.ethereumRpcUrl);
  const account = privateKeyToAccount(config.privateKey);

  _publicClient = createPublicClient({ transport });
  const walletClient = createWalletClient({ transport, account });
  const signer = walletClientToSigner(walletClient);
  _routerClient = getRouterClient({ address: config.routerAddress, publicClient: _publicClient, signer });

  return { routerClient: _routerClient, publicClient: _publicClient };
}

export async function requestCodeValidation(code: Uint8Array, codeId: Hash) {
  const { routerClient, publicClient } = await getClients();

  const tx = await routerClient.requestCodeValidation(code);
  console.log({ tx }, 'Transaction created');

  if (tx.codeId.toLowerCase() !== codeId.toLowerCase()) {
    throw new Error(`Code ID mismatch: expected ${codeId}, got ${tx.codeId}`);
  }

  const transactionHash = await tx.send();
  const receipt = await publicClient.waitForTransactionReceipt({ hash: transactionHash });

  return {
    transactionHash,
    status: receipt.status,
  };
}
