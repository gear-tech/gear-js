import type { Address } from 'viem';

export type ISubscriptionCallback<Error = unknown, Result = unknown> = (
  error: Error,
  result: Result,
) => void | Promise<void>;

export interface IVaraEthProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send<Result = unknown>(method: string, parameters: unknown[], options?: { timeout?: number }): Promise<Result>;
  subscribe<Error = unknown, Result = unknown>(
    method: string,
    unsubscribeMethod: string,
    parameters: unknown[],
    callback: ISubscriptionCallback<Error, Result>,
  ): Promise<() => void>;
}

export interface IVaraEthValidatorPoolProvider extends IVaraEthProvider {
  readonly isPool: true;
  readonly validatorAddresses: Address[];
  setActiveValidator(address: Address): void;
  removeValidator(address: Address): Promise<void>;
  addValidator(address: Address, url: string): Promise<void>;
}

export type WsUrl = `ws://${string}` | `wss://${string}`;
export type HttpUrl = `http://${string}` | `https://${string}`;
