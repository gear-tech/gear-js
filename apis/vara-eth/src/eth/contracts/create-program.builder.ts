import type { Address, Hex, PublicClient, Signature } from 'viem';
import { encodeFunctionData } from 'viem/utils';

import type { ITransactionSigner } from '../../types/signer.js';
import { getRVSComponents } from '../../util/signature.js';
import { IROUTER_ABI } from '../abi/IRouter.js';
import type { CreateProgramHelpers } from '../interfaces/router.js';
import type { ITxManager, TxManagerWithHelpers } from '../interfaces/tx-manager.js';
import { TxManager } from '../tx-manager.js';
import { getOverrideInitializer, getProgramId, getSalt } from './router.helper.js';

/**
 * Fluent builder for assembling a program-creation transaction.
 *
 * Use {@link RouterClient.createProgramBuilder} to obtain an instance — do not
 * construct this class directly.
 *
 * Call any combination of the `with*` setter methods, then call {@link build} to
 * produce a {@link TxManagerWithHelpers} ready to send. The correct on-chain
 * function is selected automatically:
 *
 * | `.withAbiInterface()` | `.withExecutableBalance()` | On-chain function |
 * |---|---|---|
 * | — | — | `createProgram` |
 * | ✓ | — | `createProgramWithAbiInterface` |
 * | — | ✓ | `createProgramWithExecutableBalance` |
 * | ✓ | ✓ | `createProgramWithAbiInterfaceAndExecutableBalance` |
 */
export class CreateProgramBuilder {
  private _salt?: Hex;
  private _overrideInitializer?: Address;
  private _abiInterface?: Address;
  private _executableBalance?: { amount: bigint; deadline: bigint; signature: Signature | Hex };

  constructor(
    private readonly _codeId: Hex,
    private readonly _pc: PublicClient,
    private readonly _getSigner: () => ITransactionSigner,
    private readonly _contractAddress: Address,
  ) {}

  /**
   * Sets a deterministic salt for program address derivation.
   * When omitted, a random 32-byte salt is generated automatically.
   *
   * @param salt - 32-byte hex salt
   */
  withSalt(salt: Hex): this {
    this._salt = salt;
    return this;
  }

  /**
   * Overrides the initializer address. When omitted (or set to the zero address),
   * `msg.sender` is used as the initializer.
   *
   * @param address - Address to use as the initializer instead of `msg.sender`
   */
  withOverrideInitializer(address: Address): this {
    this._overrideInitializer = address;
    return this;
  }

  /**
   * Attaches a Solidity ABI interface contract to the deployed Mirror, enabling
   * Etherscan to display the program's ABI. Causes the Mirror to be deployed with
   * `isSmall = false`.
   *
   * @param address - Address of the deployed Solidity ABI contract
   */
  withAbiInterface(address: Address): this {
    this._abiInterface = address;
    return this;
  }

  /**
   * Funds the Mirror with an initial WVARA executable balance on deployment.
   * Uses an EIP-2612 permit signature so no prior `approve` call is required.
   * Obtain the signature via {@link WrappedVaraClient.prepareAndSignPermitData}.
   *
   * @param amount - Amount of WVARA to transfer to the Mirror as executable balance
   * @param deadline - Expiry timestamp for the WVARA permit signature
   * @param signature - EIP-712 permit signature authorising the WVARA transfer
   */
  withExecutableBalance(amount: bigint, deadline: bigint, signature: Signature | Hex): this {
    this._executableBalance = { amount, deadline, signature };
    return this;
  }

  /**
   * Encodes the transaction and returns a transaction manager ready to send.
   * Automatically selects the correct on-chain function based on the configured options.
   *
   * @returns A transaction manager with a {@link CreateProgramHelpers.getProgramId | getProgramId} helper
   */
  build(): TxManagerWithHelpers<CreateProgramHelpers> {
    const salt = getSalt(this._salt);
    const overrideInitializer = getOverrideInitializer(this._overrideInitializer);

    let data: Hex;

    if (this._abiInterface !== undefined && this._executableBalance !== undefined) {
      const { v, r, s } = getRVSComponents(this._executableBalance.signature);
      data = encodeFunctionData({
        abi: IROUTER_ABI,
        functionName: 'createProgramWithAbiInterfaceAndExecutableBalance',
        args: [
          this._codeId,
          salt,
          overrideInitializer,
          this._abiInterface,
          this._executableBalance.amount,
          this._executableBalance.deadline,
          v,
          r,
          s,
        ],
      });
    } else if (this._abiInterface !== undefined) {
      data = encodeFunctionData({
        abi: IROUTER_ABI,
        functionName: 'createProgramWithAbiInterface',
        args: [this._codeId, salt, overrideInitializer, this._abiInterface],
      });
    } else if (this._executableBalance !== undefined) {
      const { v, r, s } = getRVSComponents(this._executableBalance.signature);
      data = encodeFunctionData({
        abi: IROUTER_ABI,
        functionName: 'createProgramWithExecutableBalance',
        args: [
          this._codeId,
          salt,
          overrideInitializer,
          this._executableBalance.amount,
          this._executableBalance.deadline,
          v,
          r,
          s,
        ],
      });
    } else {
      data = encodeFunctionData({
        abi: IROUTER_ABI,
        functionName: 'createProgram',
        args: [this._codeId, salt, overrideInitializer],
      });
    }

    const manager: ITxManager = new TxManager(
      this._pc,
      this._getSigner(),
      { to: this._contractAddress, data },
      IROUTER_ABI,
      {
        getProgramId,
      },
    );

    return manager as TxManagerWithHelpers<CreateProgramHelpers>;
  }
}
