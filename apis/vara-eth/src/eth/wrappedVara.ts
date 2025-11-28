import type { Address, Hex } from 'viem';
import { encodeFunctionData } from 'viem';

import { convertEventParams } from '../util/index.js';
import { WrappedVaraTxHelpers, ApprovalLog, TransferLog, WVaraTransferHelpers } from './interfaces/wrappedVara.js';
import { IWRAPPEDVARA_ABI, IWrappedVaraContract } from './abi/IWrappedVara.js';
import { TxManager } from './tx-manager.js';
import { ITxManager, type TxManagerWithHelpers } from './interfaces/tx-manager.js';
import { EthereumClient } from './ethereumClient.js';

/**
 * A contract wrapper for interacting with the WrappedVara token.
 * Provides methods for approving token spending and other ERC20 operations.
 */
export class WrappedVaraContract implements IWrappedVaraContract {
  /**
   * Creates a new WrappedVaraContract instance.
   *
   * @param address - The address of the WrappedVara contract
   * @param ethereumClient - The Ethereum client for sending transactions
   */
  constructor(
    public readonly address: Address,
    private ethereumClient: EthereumClient,
  ) {}

  allowance(owner: Hex, spender: Hex): Promise<bigint> {
    return this.ethereumClient.readContract(this.address, IWRAPPEDVARA_ABI, 'allowance', [owner, spender]);
  }

  balanceOf(account: string): Promise<bigint> {
    return this.ethereumClient.readContract(this.address, IWRAPPEDVARA_ABI, 'balanceOf', [account as Address]);
  }

  decimals(): Promise<number> {
    return this.ethereumClient.readContract(this.address, IWRAPPEDVARA_ABI, 'decimals');
  }

  name(): Promise<string> {
    return this.ethereumClient.readContract(this.address, IWRAPPEDVARA_ABI, 'name');
  }

  symbol(): Promise<string> {
    return this.ethereumClient.readContract(this.address, IWRAPPEDVARA_ABI, 'symbol');
  }

  totalSupply(): Promise<bigint> {
    return this.ethereumClient.readContract(this.address, IWRAPPEDVARA_ABI, 'totalSupply');
  }

  /**
   * Approves the specified address to spend the specified amount of tokens on behalf of the caller.
   *
   * @param spender - The address to be approved for spending
   * @param value - The amount of tokens to be approved for spending
   * @returns A transaction manager with approval-specific helper functions
   */
  async approve(spender: Address, value: bigint): Promise<TxManagerWithHelpers<WrappedVaraTxHelpers>> {
    const tx = {
      to: this.address,
      data: encodeFunctionData({
        abi: IWRAPPEDVARA_ABI,
        functionName: 'approve',
        args: [spender, value],
      }),
    };

    const txManager: ITxManager = new TxManager(this.ethereumClient, tx, IWRAPPEDVARA_ABI, {
      getApprovalLog: (manager) => async () => {
        const event = await manager.findEvent('Approval');
        return convertEventParams<ApprovalLog>(event);
      },
    });

    return txManager as TxManagerWithHelpers<WrappedVaraTxHelpers>;
  }

  async transfer(to: Address, value: bigint): Promise<TxManagerWithHelpers<WVaraTransferHelpers>> {
    const tx = {
      to: this.address,
      data: encodeFunctionData({
        abi: IWRAPPEDVARA_ABI,
        functionName: 'transfer',
        args: [to, value],
      }),
    };

    const txManager: ITxManager = new TxManager(this.ethereumClient, tx, IWRAPPEDVARA_ABI, {
      getTransferLog: (manager) => async () => {
        const event = await manager.findEvent('Transfer');
        return convertEventParams<TransferLog>(event);
      },
    });

    return txManager as TxManagerWithHelpers<WVaraTransferHelpers>;
  }
}

/**
 * Creates a new WrappedVaraContract instance.
 *
 * @param address - The address of the WrappedVara contract
 * @param ethereumClient - The Ethereum client for interacting with the contract
 * @returns A new WrappedVaraContract instance that implements the IWrappedVaraContract interface
 */
export function getWrappedVaraClient(address: Address, ethereumClient: EthereumClient): WrappedVaraContract {
  return new WrappedVaraContract(address, ethereumClient);
}
