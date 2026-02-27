import type { Address, PublicClient } from 'viem';

import { EthereumClient } from '../eth/index.js';
import type { ITransactionSigner } from '../types/signer.js';
import type { IVaraEthProvider, IVaraEthValidatorPoolProvider } from '../types/index.js';
import { VaraEthApi } from './api.js';

/**
 * Creates a fully initialized VaraEthApi.
 *
 * Use this factory instead of constructing EthereumClient and VaraEthApi separately —
 * it handles initialization and wires everything together.
 * The EthereumClient is accessible via `api.eth` after creation.
 *
 * @param provider - Vara.Eth JSON-RPC provider (WS or HTTP, single or pool)
 * @param publicClient - Viem PublicClient connected to the Ethereum network
 * @param routerAddress - Address of the Vara.Eth Router contract on Ethereum
 * @param signer - (optional) Signer for sending on-chain transactions
 * @returns The initialized VaraEthApi instance
 *
 * @example
 * ```ts
 * const api = await createVaraEthApi(
 *   provider,
 *   publicClient,
 *   '0xRouterAddress',
 *   walletClientToSigner(walletClient),
 * );
 *
 * // Access EthereumClient via api.eth
 * const validators = await api.eth.router.validators();
 * ```
 */
export async function createVaraEthApi(
  provider: IVaraEthProvider | IVaraEthValidatorPoolProvider,
  publicClient: PublicClient,
  routerAddress: Address,
  signer?: ITransactionSigner,
): Promise<VaraEthApi> {
  const ethClient = new EthereumClient(publicClient, routerAddress, signer);
  await ethClient.waitForInitialization();
  return new VaraEthApi(provider, ethClient);
}
