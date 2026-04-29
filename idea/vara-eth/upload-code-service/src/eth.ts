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

import { config } from './config.js';

let _routerClient: RouterClient | null = null;
let _publicClient: PublicClient | null = null;

async function getClients() {
  if (_routerClient && _publicClient) return { routerClient: _routerClient, publicClient: _publicClient };

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
  deadline: bigint,
  wvaraPermitSignature: Hex,
  requestCodeValidationSignature: Hex,
) {
  const { routerClient, publicClient } = await getClients();

  const tx = await routerClient.requestCodeValidationOnBehalf(
    sender,
    code,
    blobHashes,
    deadline,
    parseSignature(requestCodeValidationSignature),
    parseSignature(wvaraPermitSignature),
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
