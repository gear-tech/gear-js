import { createLogger } from 'gear-idea-common';
import {
  createPublicClient,
  createWalletClient,
  PublicClient,
  WalletClient,
  webSocket,
  WebSocketTransport,
} from 'viem';
import { Account, privateKeyToAccount } from 'viem/accounts';
import { parseAbi, parseUnits } from 'viem/utils';
import { hoodi } from 'viem/chains';

import { FaucetType, FaucetRequest } from '../../database';
import { FaucetProcessor } from './abstract';
import config from '../../config';

const ERC20_ABI = parseAbi([
  'function transfer(address to, uint256 amount)',
  'function decimals() external view returns (uint8)',
  'error InsufficientBalance(address sender, uint256 balance, uint256 needed)',
  'error InvalidSender(address sender)',
  'error InvalidReceiver(address receiver)',
  'error InsufficientAllowance(address spender, uint256 allowance, uint256 needed)',
  'error InvalidApprover(address approver)',
  'error InvalidSpender(address spender)',
]);

const logger = createLogger('bridge');

export class VaraBridgeProcessor extends FaucetProcessor {
  private _walletClient: WalletClient<WebSocketTransport, typeof hoodi, Account>;
  private _publicClient: PublicClient;
  private _account: Account;
  private _contracts: Map<string, bigint>;

  public async init(): Promise<void> {
    this.setLogger(logger);

    const transport = webSocket(config.bridge.ethProvider);
    this._publicClient = createPublicClient({ transport, chain: hoodi });

    const chainId = await this._publicClient.getChainId();
    logger.info(`Public client created. Chain ID: ${chainId}`);

    this._account = privateKeyToAccount(config.bridge.ethPrivateKey);
    logger.info('Account created', { addr: this._account.address });

    this._walletClient = createWalletClient({ account: this._account, transport, chain: hoodi });
    logger.info('Wallet client created');

    this._contracts = new Map();
    for (const [address, value] of config.bridge.erc20Contracts) {
      const decimals = await this._publicClient.readContract({
        address,
        abi: ERC20_ABI,
        functionName: 'decimals',
      });
      this._contracts.set(address, parseUnits(value, decimals));
      logger.info(`Contract added`, { address, value: this._contracts.get(address) });
    }
  }

  protected get cronInterval(): string {
    return config.bridge.cronTime;
  }

  protected get type(): FaucetType[] {
    return [FaucetType.BridgeErc20];
  }

  protected async handleRequests(requests: FaucetRequest[]): Promise<{ success: number[]; fail: number[] }> {
    logger.info('Processing requests', { length: requests.length, target: 'vara_bridge' });

    const success = [];
    const fail = [];

    for (const { id, target, address } of requests) {
      const value = this._contracts.get(target);
      if (!value) {
        logger.error(`Contract not found for target ${target}. Skipping request ${id}`);
        continue;
      }

      logger.info(`Processing ${id}`, { target, address, value });

      try {
        const { request } = await this._publicClient.simulateContract({
          address: target,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [address, value],
          account: this._account,
        });

        const txHash = await this._walletClient.writeContract(request);

        const receipt = await this._publicClient.waitForTransactionReceipt({ hash: txHash });

        if (receipt.status === 'reverted') {
          fail.push(id);
          logger.error(`Request ${id} failed`, { hash: receipt.transactionHash, block: receipt.blockNumber });
        } else {
          success.push(id);
          logger.info(`Request ${id} succeeded`, { hash: receipt.transactionHash, block: receipt.blockNumber });
        }
      } catch (error: any) {
        logger.error(`Request ${id} failed`, { error, stack: error?.stack });
        fail.push(id);
      }
    }

    return { success, fail };
  }
}
