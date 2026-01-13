import { createPublicClient, createWalletClient, Hex, PublicClient, WalletClient, WebSocketTransport } from 'viem';
import { Account, privateKeyToAccount } from 'viem/accounts';
import { parseAbi, parseUnits } from 'viem/utils';
import { createLogger } from 'gear-idea-common';
import { hoodi } from 'viem/chains';

import { FaucetType, FaucetRequest } from '../../database';
import { FaucetProcessor } from './abstract';
import config from '../../config';

const WVARA_ABI = parseAbi([
  'function decimals() external view returns (uint8)',
  'function mint(address to, uint256 amount)',
]);

const logger = createLogger('wvara');

export class WvaraProcessor extends FaucetProcessor {
  private _walletClient: WalletClient<WebSocketTransport, typeof hoodi, Account>;
  private _publicClient: PublicClient;
  private _account: Account;
  private _address: Hex;
  private _amount: bigint;

  public async init(transport: WebSocketTransport): Promise<void> {
    this.setLogger(logger);

    this._publicClient = createPublicClient({ transport, chain: hoodi });

    const chainId = await this._publicClient.getChainId();
    logger.info(`Public client created. Chain ID: ${chainId}`);

    this._account = privateKeyToAccount(config.wvara.privateKey);
    logger.info('Account created', { addr: this._account.address });

    this._walletClient = createWalletClient({ account: this._account, transport, chain: hoodi });
    logger.info('Wallet client created');

    this._address = config.wvara.address;
    const decimals = await this._publicClient.readContract({
      address: this._address,
      abi: WVARA_ABI,
      functionName: 'decimals',
    });
    this._amount = parseUnits(config.wvara.amount, decimals);

    logger.info('Initialized', { address: this._address, amount: this._amount });
  }

  protected get cronInterval(): string {
    return config.wvara.cronTime;
  }

  protected get type(): FaucetType[] {
    return [FaucetType.WVara];
  }

  protected async handleRequests(requests: FaucetRequest[]): Promise<{ success: number[]; fail: number[] }> {
    logger.info('Handling requests', { count: requests.length });

    const success = [];
    const fail = [];

    for (const { id, address } of requests) {
      try {
        logger.info(`Request ${id}`, { args: [address, this._amount], address: this._address });
        const { request } = await this._publicClient.simulateContract({
          address: this._address,
          abi: WVARA_ABI,
          functionName: 'mint',
          args: [address, this._amount],
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
