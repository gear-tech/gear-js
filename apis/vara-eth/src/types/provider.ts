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
