import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { HexString } from '@polkadot/util/types';
import {
  AlertType,
  AlertOptions,
  TemplateAlertOptions,
  AlertInstance,
  AlertTimer,
  AlertTemplateProps,
  AlertContainerFactory,
  DefaultTemplateOptions,
} from './alert';

type ProviderProps = Omit<React.ProviderProps<never>, 'value'>;

type Account = InjectedAccountWithMeta & {
  decodedAddress: HexString;
};

// in case Object.entries return value is immutable
// ref: https://stackoverflow.com/a/60142095
type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export { AlertType };
export type {
  AlertOptions,
  TemplateAlertOptions,
  AlertInstance,
  AlertTimer,
  AlertTemplateProps,
  AlertContainerFactory,
  DefaultTemplateOptions,
  ProviderProps,
  Account,
  Entries,
};
