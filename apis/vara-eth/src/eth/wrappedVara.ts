import type { Address, Chain, Hex, PublicClient, Transport } from 'viem';
import { encodeFunctionData } from 'viem';

import { WrappedVaraTxHelpers, ApprovalLog, TransferLog, WVaraTransferHelpers } from './interfaces/wrappedVara.js';
import { ITxManager, type TxManagerWithHelpers } from './interfaces/tx-manager.js';
import { IWRAPPEDVARA_ABI, IWrappedVaraContract } from './abi/IWrappedVara.js';
import { convertEventParams } from '../util/index.js';
import { TxManager } from './tx-manager.js';
import { ISigner } from '../types/signer.js';

/**
 * A contract wrapper for interacting with the WrappedVara token.
 * Provides methods for approving token spending and other ERC20 operations.
 */
export class WrappedVaraClient<TTransport extends Transport = Transport, TChain extends Chain = Chain>
  implements IWrappedVaraContract
{
  /**
   * Creates a new WrappedVaraClient instance.
   *
   * @param address - The address of the WrappedVara contract
   * @param signer - The signer for sending transactions and signing messages
   * @param publicClient - The public client for reading data from the blockchain
   */
  constructor(
    public readonly address: Address,
    private _signer: ISigner,
    private _pc: PublicClient<TTransport, TChain>,
  ) {}

  allowance(owner: Hex, spender: Hex): Promise<bigint> {
    return this._pc.readContract({
      address: this.address,
      abi: IWRAPPEDVARA_ABI,
      functionName: 'allowance',
      args: [owner, spender],
    });
  }

  balanceOf(account: string): Promise<bigint> {
    return this._pc.readContract({
      address: this.address,
      abi: IWRAPPEDVARA_ABI,
      functionName: 'balanceOf',
      args: [account as Address],
    });
  }

  decimals(): Promise<number> {
    return this._pc.readContract({
      address: this.address,
      abi: IWRAPPEDVARA_ABI,
      functionName: 'decimals',
    });
  }

  name(): Promise<string> {
    return this._pc.readContract({
      address: this.address,
      abi: IWRAPPEDVARA_ABI,
      functionName: 'name',
    });
  }

  symbol(): Promise<string> {
    return this._pc.readContract({
      address: this.address,
      abi: IWRAPPEDVARA_ABI,
      functionName: 'symbol',
    });
  }

  totalSupply(): Promise<bigint> {
    return this._pc.readContract({
      address: this.address,
      abi: IWRAPPEDVARA_ABI,
      functionName: 'totalSupply',
    });
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

    const txManager: ITxManager = new TxManager(this._pc, this._signer, tx, IWRAPPEDVARA_ABI, {
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

    const txManager: ITxManager = new TxManager(this._pc, this._signer, tx, IWRAPPEDVARA_ABI, {
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
export function getWrappedVaraClient<TTransport extends Transport = Transport, TChain extends Chain = Chain>(
  address: Address,
  signer: ISigner,
  publicClient: PublicClient<TTransport, TChain>,
): WrappedVaraClient<TTransport, TChain> {
  return new WrappedVaraClient(address, signer, publicClient);
}
