export interface Expiring<T> {
  readonly value: T;
  readonly expiry: number;
}
