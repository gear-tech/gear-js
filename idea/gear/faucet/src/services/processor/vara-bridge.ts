import { createLogger } from 'gear-idea-common';
import { FaucetType, FaucetRequest } from '../../database';
import { FaucetProcessor } from './abstract';
import { BaseContract, ethers, JsonRpcProvider, TransactionResponse, Wallet } from 'ethers';
import config from '../../config';

const IFACE = () =>
  new ethers.Interface([
    'function transfer(address to, uint256 amount)',
    'function decimals() external view returns (uint8)',
    'error InsufficientBalance(address sender, uint256 balance, uint256 needed)',
    'error InvalidSender(address sender)',
    'error InvalidReceiver(address receiver)',
    'error InsufficientAllowance(address spender, uint256 allowance, uint256 needed)',
    'error InvalidApprover(address approver)',
    'error InvalidSpender(address spender)',
  ]);

interface IERC20 {
  transfer(to: string, amount: bigint): Promise<TransactionResponse>;
  decimals(): Promise<number>;
}

const logger = createLogger('bridge');

export class VaraBridgeProcessor extends FaucetProcessor {
  private _wallet: Wallet;
  private _contracts: Map<string, bigint>;

  public async init(): Promise<void> {
    this.setLogger(logger);
    const provider = new JsonRpcProvider(config.eth.providerAddress);
    const network = await provider.getNetwork();
    logger.info(`Connected to ${network.name}`);
    this._wallet = new Wallet(config.eth.privateKey, provider);
    logger.info('Account created', { addr: this._wallet.address });

    this._contracts = new Map();
    for (const [id, value] of config.eth.erc20Contracts) {
      this._contracts.set(id, ethers.parseUnits(value, await this._getDecimals(id)));
      logger.info(`Contract added`, { id, value: this._contracts.get(id) });
    }
  }

  protected get cronInterval(): string {
    return config.eth.cronTime;
  }

  protected get type(): FaucetType {
    return FaucetType.VaraBridge;
  }

  protected async handleRequests(requests: FaucetRequest[]): Promise<{ success: number[]; fail: number[] }> {
    logger.info('Processing requests', { length: requests.length, target: 'vara_bridge' });

    const success = [];
    const fail = [];

    for (const { id, target, address } of requests) {
      const value = this._contracts.get(target);
      const contract = this._getContract(target);
      logger.info(`Processing ${id}`, { target, address, value });
      try {
        const tx = await contract.transfer(address, value);
        const receipt = await tx.wait();
        if (receipt.status === 0) {
          logger.error(`Request ${id} failed`, { hash: receipt.hash, block: receipt.blockNumber });
          fail.push(id);
        } else {
          success.push(id);
          logger.info(`Request ${id} succeeded`, { hash: receipt.hash, block: receipt.blockNumber });
        }
      } catch (error) {
        this._onFailedRequest(error, id);
        fail.push(id);
      }
    }

    return { success, fail };
  }

  private _getDecimals(contract: string) {
    return this._getContract(contract).decimals();
  }

  private _getContract(id: string) {
    return BaseContract.from<IERC20>(id, IFACE(), this._wallet);
  }

  private _onFailedRequest(error: any, id: number) {
    try {
      const reason = IFACE().parseError(error.data);
      logger.error(`Request ${id} failed`, { error: error.message, stack: error.stack, reason });
    } catch (_error) {
      logger.error(`Request ${id} failed`, { error, stack: error.stack, _error });
    }
  }
}
