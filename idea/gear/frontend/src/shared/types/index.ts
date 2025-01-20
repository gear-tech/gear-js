import { IBase } from './entities';

// in case Object.entries return value is immutable
// ref: https://stackoverflow.com/a/60142095
type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type { IBase, Entries };
