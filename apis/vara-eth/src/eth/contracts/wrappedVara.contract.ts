import type { Address, Hex } from 'viem';
import { encodeFunctionData } from 'viem';

import { convertEventParams } from '../../util/index.js';
import { IWRAPPEDVARA_ABI, type IWrappedVaraContract } from '../abi/IWrappedVara.js';
import type { ITxManager, TxManagerWithHelpers } from '../interfaces/tx-manager.js';
import type {
  ApprovalLog,
  TransferLog,
  WrappedVaraTxHelpers,
  WVaraTransferHelpers,
} from '../interfaces/wrappedVara.js';
import { TxManager } from '../tx-manager.js';
import type { ContractClientParams } from './base.contract.js';
import { EIP712ContractClient } from './eip-712.contract.js';

/**
 * Contract client for the WrappedVara (WVARA) ERC-20 token.
 *
 * WrappedVara is an ERC-20 token with EIP-2612 permit support (EIP-712 signed approvals).
 * It is used throughout the co-processor as the payment token for fees and executable balances.
 */
export class WrappedVaraClient extends EIP712ContractClient<typeof IWRAPPEDVARA_ABI> implements IWrappedVaraContract {
  private _cachedDecimals: number | undefined;
  private _cachedName: string | undefined;
  private _cachedSymbol: string | undefined;

  constructor(params: Omit<ContractClientParams, 'abi'>) {
    super({ ...params, abi: IWRAPPEDVARA_ABI });
  }

  /**
   * Returns the EIP-2612 permit nonce for the given owner address.
   * @param owner - Token holder address
   */
  nonces(owner: Address): Promise<bigint> {
    return this.read('nonces', [owner]);
  }

  /** Returns the owner address of the WrappedVara contract. */
  owner(): Promise<string> {
    return this.read('owner');
  }

  /**
   * Returns the remaining token allowance that `spender` may transfer on behalf of `owner`.
   * @param owner - Token holder address
   * @param spender - Approved spender address
   */
  allowance(owner: Address, spender: Address): Promise<bigint> {
    return this.read('allowance', [owner, spender]);
  }

  /**
   * Returns the WVARA token balance of the given account.
   * @param account - Address to query
   */
  balanceOf(account: Address): Promise<bigint> {
    return this.read('balanceOf', [account]);
  }

  /** Returns the number of decimals used by the token (cached after first fetch). */
  async decimals(): Promise<number> {
    if (this._cachedDecimals === undefined) {
      this._cachedDecimals = await this.read('decimals');
    }
    return this._cachedDecimals;
  }

  /** Returns the token name (cached after first fetch). */
  async name(): Promise<string> {
    if (this._cachedName === undefined) {
      this._cachedName = await this.read('name');
    }
    return this._cachedName;
  }

  /** Returns the token symbol (cached after first fetch). */
  async symbol(): Promise<string> {
    if (this._cachedSymbol === undefined) {
      this._cachedSymbol = await this.read('symbol');
    }
    return this._cachedSymbol;
  }

  /** Returns the total WVARA token supply. */
  totalSupply(): Promise<bigint> {
    return this.read('totalSupply');
  }

  /**
   * Approves the specified address to spend the specified amount of tokens on behalf of the caller.
   *
   * @param spender - The address to be approved for spending
   * @param value - The amount of tokens to be approved for spending
   * @returns A transaction manager with approval-specific helper functions
   */
  async approve(spender: Address, value: bigint): Promise<TxManagerWithHelpers<WrappedVaraTxHelpers>> {
    const signer = this._ensureSigner();
    const tx = {
      to: this.address,
      data: encodeFunctionData({
        abi: IWRAPPEDVARA_ABI,
        functionName: 'approve',
        args: [spender, value],
      }),
    };

    const txManager: ITxManager = new TxManager(this._pc, signer, tx, IWRAPPEDVARA_ABI, {
      getApprovalLog: (manager) => async () => {
        const event = await manager.findEvent('Approval');
        return convertEventParams<ApprovalLog>(event);
      },
    });

    return txManager as TxManagerWithHelpers<WrappedVaraTxHelpers>;
  }

  async transfer(to: Address, value: bigint): Promise<TxManagerWithHelpers<WVaraTransferHelpers>> {
    const signer = this._ensureSigner();
    const tx = {
      to: this.address,
      data: encodeFunctionData({
        abi: IWRAPPEDVARA_ABI,
        functionName: 'transfer',
        args: [to, value],
      }),
    };

    const txManager: ITxManager = new TxManager(this._pc, signer, tx, IWRAPPEDVARA_ABI, {
      getTransferLog: (manager) => async () => {
        const event = await manager.findEvent('Transfer');
        return convertEventParams<TransferLog>(event);
      },
    });

    return txManager as TxManagerWithHelpers<WVaraTransferHelpers>;
  }

  permit(owner: Address, spender: Address, value: bigint, deadline: bigint, v: number, r: Hex, s: Hex): ITxManager {
    const signer = this._ensureSigner();
    const tx = {
      to: this.address,
      data: encodeFunctionData({
        abi: IWRAPPEDVARA_ABI,
        functionName: 'permit',
        args: [owner, spender, value, deadline, v, r, s],
      }),
    };

    return new TxManager(this._pc, signer, tx, IWRAPPEDVARA_ABI);
  }

  /**
   * Prepares and signs permit data for the given spender, value, and deadline.
   * @param spender The address of the spender.
   * @param value The value to be approved.
   * @param deadline The deadline for the permit.
   *
   * @returns The owner, spender, value, deadline, and signature of the permit.
   */
  async prepareAndSignPermitData(
    spender: Address,
    value: bigint,
    deadline: bigint,
  ): Promise<{
    owner: Address;
    spender: Address;
    value: bigint;
    deadline: bigint;
    signature: { r: Hex; v: number; s: Hex };
  }> {
    const signer = this._ensureSigner();
    const owner = await signer.getAddress();

    const [nonce, domain] = await Promise.all([this.nonces(owner), this.eip712Domain()]);

    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };

    const { r, v, s } = await signer.signTypedData({
      message: { owner, spender, value, nonce, deadline },
      types,
      primaryType: 'Permit',
      domain,
    });

    return { owner, spender, value, deadline, signature: { r, v, s } };
  }
}

/**
 * Creates a new WrappedVaraContract instance.
 *
 * @param params - {@link ContractClientParams} parameters for creating the WrappedVara contract client
 * @returns A new {@link WrappedVaraClient} instance that implements the {@link IWrappedVaraContract} interface
 */
export function getWrappedVaraClient(params: Omit<ContractClientParams, 'abi'>): WrappedVaraClient {
  return new WrappedVaraClient(params);
}
