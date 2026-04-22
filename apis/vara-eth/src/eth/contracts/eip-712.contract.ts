import type { Abi, TypedDataDomain, WatchContractEventReturnType } from 'viem';

import { EIP712_ABI } from '../abi/EIP712.js';
import type { LogCallbackParams } from '../interfaces/logs/base.log.js';
import { BaseContractClient } from './base.contract.js';

/** Base class for contracts that implement EIP-712 typed-data signing (ERC-5267). */
export class EIP712ContractClient<const abi extends Abi> extends BaseContractClient<abi> {
  private _cachedDomain: TypedDataDomain | undefined;

  /**
   * Returns the EIP-712 domain for this contract, fetching and caching it on first call.
   * @returns The typed-data domain (name, version, chainId, verifyingContract, salt)
   */
  async eip712Domain(): Promise<TypedDataDomain> {
    if (this._cachedDomain) {
      // TODO: consider watching DomainChanged event for recaching
      return this._cachedDomain;
    }

    const domain = await this._pc.readContract({
      address: this.address,
      abi: EIP712_ABI,
      functionName: 'eip712Domain',
    });

    const typedDataDomain = {
      name: domain[1],
      version: domain[2],
      chainId: domain[3],
      verifyingContract: domain[4],
      salt: domain[5],
    };

    this._cachedDomain = typedDataDomain;
    return typedDataDomain;
  }

  /**
   * Subscribes to `EIP712DomainChanged` events emitted when the domain is updated.
   * @param callback - Called with block/tx metadata for each event log
   * @returns Unwatch function — call it to stop listening
   */
  watchEIP712DomainChangedEvent(callback: (params: LogCallbackParams) => void): WatchContractEventReturnType {
    return this._pc.watchContractEvent({
      address: this.address,
      abi: EIP712_ABI,
      eventName: 'EIP712DomainChanged',
      onLogs: (logs) => {
        for (const log of logs) {
          callback({
            blockNumber: log.blockNumber,
            blockHash: log.blockHash,
            transactionIndex: log.transactionIndex,
            transactionHash: log.transactionHash,
          });
        }
      },
    });
  }
}
