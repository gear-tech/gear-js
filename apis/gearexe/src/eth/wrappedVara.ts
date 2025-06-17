import { BaseContract, Signer, Wallet } from 'ethers';
import { convertEventParams as convertEventParameters } from '../util/index.js';
import { TxManager, TxManagerWithHelpers } from './tx-manager.js';
import { IWRAPPEDVARA_INTERFACE, IWrappedVaraContract } from './abi/IWrappedVara.js';
import { WrappedVaraTxHelpers, ApprovalLog } from './interfaces/wrappedVara.js';
import { ITxManager } from './interfaces/tx-manager.js';

// Interfaces moved to ./interfaces/wrappedVara.js

/**
 * A contract wrapper for interacting with the WrappedVara token on the Gear.Exe network.
 * Provides methods for approving token spending and other ERC20 operations.
 */
export class WrappedVaraContract extends BaseContract implements IWrappedVaraContract {
  private _wallet: Wallet | Signer;

  declare allowance: (owner: string, spender: string) => Promise<bigint>;
  declare balanceOf: (account: string) => Promise<bigint>;
  declare decimals: () => Promise<bigint>;
  declare name: () => Promise<string>;
  declare symbol: () => Promise<string>;
  declare totalSupply: () => Promise<bigint>;

  /**
   * Creates a new WrappedVaraContract instance.
   *
   * @param address - The address of the WrappedVara contract
   * @param wallet - The wallet or signer to use for transactions
   */
  constructor(address: string, wallet: Wallet | Signer) {
    super(address, IWRAPPEDVARA_INTERFACE, wallet);
    this._wallet = wallet;
  }

  /**
   * Approves the specified address to spend the specified amount of tokens on behalf of the caller.
   *
   * @param address - The address to be approved for spending
   * @param value - The amount of tokens to be approved for spending
   * @returns A transaction manager with approval-specific helper functions
   */
  async approve(address: string, value: bigint): Promise<TxManagerWithHelpers<WrappedVaraTxHelpers>> {
    const function_ = this.getFunction('approve');
    const tx = await function_.populateTransaction(address, value);

    const txManager: ITxManager = new TxManager(this._wallet as Wallet, tx, IWRAPPEDVARA_INTERFACE, {
      getApprovalLog: (manager) => async () => {
        const event = await manager.findEvent('Approval');

        return convertEventParameters<ApprovalLog>(event);
      },
    });

    return txManager as TxManagerWithHelpers<WrappedVaraTxHelpers>;
  }
}

/**
 * Creates a new WrappedVaraContract instance.
 *
 * @param address - The address of the WrappedVara contract
 * @param wallet - The wallet or signer to use for transactions
 * @returns A new WrappedVaraContract instance that implements the IWrappedVaraContract interface
 */
export function getWrappedVaraContract(address: string, wallet: Wallet | Signer): WrappedVaraContract {
  return new WrappedVaraContract(address, wallet);
}
