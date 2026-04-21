import { getRouterClient, type RouterClient } from '@vara-eth/api/eth/router';
import { walletClientToSigner } from '@vara-eth/api/signer';
import {
  type Address,
  createPublicClient,
  createWalletClient,
  type Hash,
  type Hex,
  type PublicClient,
  webSocket,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { getConfig } from './config.js';

let _routerClient: RouterClient | null = null;
let _publicClient: PublicClient | null = null;

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

export async function requestCodeValidationOnBehalf(
  code: Uint8Array,
  codeId: Hash,
  sender: Address,
  blobHashes: Hash[],
  deadline: number,
  v1: number,
  r1: Hash,
  s1: Hash,
  v2: number,
  r2: Hash,
  s2: Hash,
) {
  const { routerClient, publicClient } = await getClients();

  const tx = await routerClient.requestCodeValidationOnBehalf(
    code,
    sender,
    blobHashes as Hex[],
    deadline,
    v1,
    r1 as Hex,
    s1 as Hex,
    v2,
    r2 as Hex,
    s2 as Hex,
  );
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
