export type ISubscriptionCallback = <Error = unknown, Result = unknown>(
  error: Error,
  result: Result,
) => void | Promise<void>;

export interface IGearexeProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send<Result = unknown>(method: string, parameters: unknown[]): Promise<Result>;
  subscribe(method: string, parameters: unknown[], callback: ISubscriptionCallback): number;
  unsubscribe(id: number): void;
}
