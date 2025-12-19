import type { Address } from 'viem';

import type { ISubscriptionCallback, IVaraEthValidatorPoolProvider } from '../types/index.js';
import { type ConnectionOptions, WsVaraEthProvider } from './ws.js';

export type ValidatorPool = { url: string; address: Address }[];

export function getDefaultVaraEthTestnetValidatorPool(): ValidatorPool {
  return [
    { address: '0x7462303A1Aae98C96F8CAd6ECeC91DaD29537518', url: 'wss://vara-eth-validator-1.gear-tech.io' },
    { address: '0xaEe0Cc6CAa1cFbee638470a995b9Bb75c1aB0972', url: 'wss://vara-eth-validator-2.gear-tech.io' },
    { address: '0xCC4E78EA999374E348E6D583af19b0F0E6689DE8', url: 'wss://vara-eth-validator-3.gear-tech.io' },
    { address: '0x2aD8150a579E12f6Dfb418100dbcA0B0255E8dBA', url: 'wss://vara-eth-validator-4.gear-tech.io' },
  ];
}

export class VaraEthValidatorWsPool implements IVaraEthValidatorPoolProvider {
  private _validators: Map<string, WsVaraEthProvider>;
  private _activeValidator: string;
  public readonly isPool = true;

  constructor(
    pool: ValidatorPool,
    private options: ConnectionOptions = {},
  ) {
    if (pool.length === 0) {
      throw new Error('Validator pool is empty');
    }

    this._validators = new Map();

    for (const { url, address } of pool) {
      this._validators.set(address.toLowerCase() as Address, new WsVaraEthProvider(url, options));
    }

    const validator = this._validators.keys().next();

    this._activeValidator = validator.value!;
  }

  get validatorAddresses(): Address[] {
    return Array.from(this._validators.keys()) as Address[];
  }

  setActiveValidator(address: Address): void {
    const _address = address.toLowerCase();
    if (!this._validators.has(_address)) {
      throw new Error('Validator not found');
    }

    this._activeValidator = _address;
  }

  async removeValidator(address: Address): Promise<void> {
    const _address = address.toLowerCase();
    if (_address === this._activeValidator) {
      throw new Error('Cannot remove active validator');
    }
    const validator = this._validators.get(_address);

    if (validator) {
      this._validators.delete(_address);
      await validator.disconnect();
    }
  }

  async addValidator(address: Address, url: string): Promise<void> {
    this._validators.set(address.toLowerCase(), new WsVaraEthProvider(url, { ...this.options, autoConnect: true }));
  }

  async connect(): Promise<void> {
    await Promise.all(Array.from(this._validators.values()).map((validator) => validator.connect()));
  }

  async disconnect(): Promise<void> {
    await Promise.all(Array.from(this._validators.values()).map((validator) => validator.disconnect()));
  }

  send<Result = unknown>(method: string, parameters: unknown[], options?: { timeout?: number }): Promise<Result> {
    const connection = this._validators.get(this._activeValidator);

    if (!connection) {
      throw new Error('Active validator not found');
    }

    return connection.send<Result>(method, parameters, options);
  }

  subscribe<Error = unknown, Result = unknown>(
    method: string,
    unsubscribeMethod: string,
    parameters: unknown[],
    callback: ISubscriptionCallback<Error, Result>,
  ): Promise<() => void> {
    const connection = this._validators.get(this._activeValidator);

    if (!connection) {
      throw new Error('Active validator not found');
    }

    return connection.subscribe<Error, Result>(method, unsubscribeMethod, parameters, callback);
  }
}
