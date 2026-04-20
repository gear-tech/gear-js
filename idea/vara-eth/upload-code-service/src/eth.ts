import { getRouterClient } from '@vara-eth/api/eth/router';
import { walletClientToSigner } from '@vara-eth/api/signer';
import { createPublicClient, createWalletClient, type Hash, webSocket } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { config } from './config.js';

const transport = webSocket(config.ethereumRpcUrl);
const account = privateKeyToAccount(config.privateKey);

const publicClient = createPublicClient({ transport });
const walletClient = createWalletClient({ transport, account });
const signer = walletClientToSigner(walletClient);

const routerClient = getRouterClient({ address: config.routerAddress, publicClient, signer });

export async function requestCodeValidation(code: Uint8Array, codeId: Hash) {
  const tx = await routerClient.requestCodeValidation(code);
  console.log({ tx }, 'Transaction created');

  if (tx.codeId.toLowerCase() !== codeId.toLowerCase()) {
    throw new Error(`Code ID mismatch: expected ${codeId}, got ${tx.codeId}`);
  }

  const transactionHash = await tx.send();

  const receipt = await publicClient.waitForTransactionReceipt({ hash: transactionHash });

  return {
    transactionHash: transactionHash,
    status: receipt.status,
  };
}
